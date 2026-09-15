"""
Module Sinh Script FFmpeg Xuất Video MP4 (Batch Script)
Hỗ trợ overlay B-roll lên A-roll theo đúng dòng thời gian.
"""

from typing import List, Dict, Any
from urllib.parse import unquote

from engine.domain.edit_decision import kept_segments, remap_placements

class MP4Exporter:
    def __init__(self, project_name: str = "CreatorUtils_Export", width: int = 3840, height: int = 2160):
        self.project_name = project_name
        self.width = width
        self.height = height

    @staticmethod
    def _value(item: Dict[str, Any], snake: str, camel: str, default: Any = None) -> Any:
        return item.get(snake, item.get(camel, default))

    def build_ffmpeg_command(self, aroll_file: str, total_duration_sec: float, broll_placements: List[Dict[str, Any]], cuts: List[Dict[str, Any]] | None = None, pip_x_pct: float = 0.56, pip_y_pct: float = 0.03, pip_scale_pct: float = 0.40, output_file: str = "output.mp4") -> List[str]:
        """
        Sinh danh sách tham số lệnh FFmpeg để render MP4
        """
        segments = kept_segments(cuts or [], total_duration_sec)
        placements = remap_placements(broll_placements, segments)
        
        aroll_name = unquote(aroll_file)
        
        aroll_name = unquote(aroll_file)
        
        cmd = ['ffmpeg', '-y']
        # Input 0: Full A-roll for audio ONLY
        cmd.extend(['-i', aroll_name])
        
        input_idx = 1
        filter_complex = []
        video_slices = []
        current_a_time = 0.0
        
        # Resolution & PiP Setup
        aroll_scale = f"scale={self.width}:{self.height}:force_original_aspect_ratio=decrease,pad={self.width}:{self.height}:(ow-iw)/2:(oh-ih)/2"
        norm = "fps=30,format=yuv420p,setsar=1"
        # Determine PiP size based on scale percentage (Width only, let FFmpeg preserve intrinsic aspect ratio for Height)
        pip_w = int(self.width * pip_scale_pct)
        pip_w += pip_w % 2
        
        # Calculate exactly based on percentages, ensuring it is an even number for FFmpeg
        pip_x = int(self.width * pip_x_pct)
        pip_x -= pip_x % 2
        pip_y = int(self.height * pip_y_pct)
        pip_y -= pip_y % 2
        
        broll_scale = f"scale={pip_w}:-2"
        
        concat_inputs = []
        for i, seg in enumerate(segments):
            start = seg['sourceStartSec']
            end = seg['sourceEndSec']
            filter_complex.append(f"[0:v]trim=start={start}:end={end},setpts=PTS-STARTPTS,{aroll_scale},{norm}[v{i}]")
            filter_complex.append(f"[0:a]atrim=start={start}:end={end},asetpts=PTS-STARTPTS[a{i}]")
            concat_inputs.append(f"[v{i}][a{i}]")
            
        concat_str = "".join(concat_inputs)
        filter_complex.append(f"{concat_str}concat=n={len(segments)}:v=1:a=1[base_v][base_a]")
        
        current_v = "base_v"
        
        for i, b in enumerate(placements):
            start_sec = float(self._value(b, "start_sec", "startSec", 0))
            end_sec = float(self._value(b, "end_sec", "endSec", 0))
            source_in = float(self._value(b, "source_in_sec", "sourceInSec", 0))
            duration = float(self._value(b, "duration_sec", "durationSec", 0))
            clip_name = unquote(self._value(b, "clip_name", "clipName", f"{self._value(b, 'clip_id', 'clipId')}.mov"))
            
            idx = i + 1
            cmd.extend(['-ss', str(source_in), '-t', str(duration), '-i', clip_name])
            
            b_lbl = f"b_pip_{idx}"
            filter_complex.append(f"[{idx}:v]setpts=PTS-STARTPTS+{start_sec}/TB,{broll_scale},{norm}[{b_lbl}]")
            
            ov_lbl = f"ov_{idx}"
            filter_complex.append(f"[{current_v}][{b_lbl}]overlay=x={pip_x}:y={pip_y}:enable='between(t,{start_sec},{end_sec})':eof_action=pass[{ov_lbl}]")
            current_v = ov_lbl
            
        filter_str = ";".join(filter_complex)
        
        cmd.extend(['-filter_complex', filter_str])
        cmd.extend(['-map', f'[{current_v}]'])
        cmd.extend(['-map', '[base_a]'])

        
        cmd.extend(['-c:v', 'libx264', '-preset', 'fast', '-crf', '23'])
        cmd.extend(['-c:a', 'aac', '-b:a', '192k'])
        
        safe_name = "".join([c if c.isalnum() else "_" for c in self.project_name])
        output_file = f"{safe_name}_export.mp4"
        cmd.append(output_file)
        
        return cmd

    def generate_bat_script(self, aroll_file: str, total_duration_sec: float, broll_placements: List[Dict[str, Any]], cuts: List[Dict[str, Any]] | None = None, pip_x_pct: float = 0.56, pip_y_pct: float = 0.03, pip_scale_pct: float = 0.40) -> str:
        """
        Sinh nội dung file .bat chứa lệnh FFmpeg để render MP4 (Legacy)
        """
        safe_name = "".join([c if c.isalnum() else "_" for c in self.project_name])
        output_file = f"{safe_name}_export.mp4"
        
        cmd = self.build_ffmpeg_command(aroll_file, total_duration_sec, broll_placements, cuts, pip_x_pct, pip_y_pct, pip_scale_pct, output_file)
        
        # Add quotes to arguments with spaces or special characters for the .bat file
        bat_cmd = []
        for arg in cmd:
            if " " in arg or ";" in arg or "=" in arg or "[" in arg or "]" in arg:
                if not arg.startswith('"') and not arg.endswith('"'):
                    bat_cmd.append(f'"{arg}"')
                else:
                    bat_cmd.append(arg)
            else:
                bat_cmd.append(arg)
        
        bat_content = f"@echo off\n"
        bat_content += f"echo Chuan bi render MP4...\n"
        bat_content += " ".join(bat_cmd) + "\n"
        bat_content += "pause\n"
        
        return bat_content
