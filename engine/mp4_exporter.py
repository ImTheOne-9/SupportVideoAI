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

    def generate_bat_script(self, aroll_file: str, total_duration_sec: float, broll_placements: List[Dict[str, Any]], cuts: List[Dict[str, Any]] | None = None) -> str:
        """
        Sinh nội dung file .bat chứa lệnh FFmpeg để render MP4
        """
        segments = kept_segments(cuts or [], total_duration_sec)
        placements = remap_placements(broll_placements, segments)
        
        aroll_name = unquote(aroll_file)
        
        cmd = ['ffmpeg', '-y']
        # Input 0: Full A-roll for audio ONLY
        cmd.extend(['-i', f'"{aroll_name}"'])
        
        input_idx = 1
        filter_complex = []
        video_slices = []
        current_a_time = 0.0
        
        # Resolution & PiP Setup
        aroll_scale = f"scale={self.width}:{self.height}:force_original_aspect_ratio=decrease,pad={self.width}:{self.height}:(ow-iw)/2:(oh-ih)/2"
        norm = "fps=30,format=yuv420p,setsar=1"
        
        pip_w = int(self.width * 0.40)
        pip_w += pip_w % 2
        pip_h = int(pip_w * 9 / 16)
        pip_h += pip_h % 2
        margin_x = int(self.width * 0.04)
        margin_y = int(self.height * 0.03)
        pip_x = self.width - pip_w - margin_x
        pip_y = margin_y
        
        broll_scale = f"scale={pip_w}:{pip_h}:force_original_aspect_ratio=increase,crop={pip_w}:{pip_h}"
        
        for i, b in enumerate(placements):
            start_sec = float(self._value(b, "start_sec", "startSec", 0))
            end_sec = float(self._value(b, "end_sec", "endSec", 0))
            source_in = float(self._value(b, "source_in_sec", "sourceInSec", 0))
            duration = float(self._value(b, "duration_sec", "durationSec", 0))
            clip_name = unquote(self._value(b, "clip_name", "clipName", f"{self._value(b, 'clip_id', 'clipId')}.mov"))
            
            # 1. A-roll Gap Slice
            if start_sec > current_a_time:
                a_dur = start_sec - current_a_time
                cmd.extend(['-ss', str(current_a_time), '-t', str(a_dur), '-i', f'"{aroll_name}"'])
                lbl = f"a_gap_{i}"
                filter_complex.append(f"[{input_idx}:v]setpts=PTS-STARTPTS,{aroll_scale},{norm}[{lbl}]")
                video_slices.append(lbl)
                input_idx += 1
                
            # 2. A-roll Base Slice for Overlay
            cmd.extend(['-ss', str(start_sec), '-t', str(duration), '-i', f'"{aroll_name}"'])
            a_lbl = f"a_base_{i}"
            filter_complex.append(f"[{input_idx}:v]setpts=PTS-STARTPTS,{aroll_scale},{norm}[{a_lbl}]")
            input_idx += 1
            
            # 3. B-roll PiP Slice
            cmd.extend(['-ss', str(source_in), '-t', str(duration), '-i', f'"{clip_name}"'])
            b_lbl = f"b_pip_{i}"
            filter_complex.append(f"[{input_idx}:v]setpts=PTS-STARTPTS,{broll_scale},{norm}[{b_lbl}]")
            input_idx += 1
            
            # 4. Apply Overlay
            ov_lbl = f"ov_{i}"
            filter_complex.append(f"[{a_lbl}][{b_lbl}]overlay=x={pip_x}:y={pip_y}[{ov_lbl}]")
            video_slices.append(ov_lbl)
            
            current_a_time = end_sec
            
        # Final A-roll Gap Slice
        if current_a_time < total_duration_sec - 0.05:
            cmd.extend(['-ss', str(current_a_time), '-i', f'"{aroll_name}"'])
            lbl = "a_end"
            filter_complex.append(f"[{input_idx}:v]setpts=PTS-STARTPTS,{aroll_scale},{norm}[{lbl}]")
            video_slices.append(lbl)
            
        # Concat all video slices
        if len(video_slices) > 1:
            concat_inputs = "".join([f"[{lbl}]" for lbl in video_slices])
            filter_complex.append(f"{concat_inputs}concat=n={len(video_slices)}:v=1:a=0[outv]")
            current_main = "outv"
        elif len(video_slices) == 1:
            current_main = video_slices[0]
        else:
            filter_complex.append(f"[0:v]{aroll_scale},{norm}[outv]")
            current_main = "outv"
            
        filter_str = "; ".join(filter_complex)
        
        cmd.extend(['-filter_complex', f'"{filter_str}"'])
        cmd.extend(['-map', f'"[{current_main}]"'])
        cmd.extend(['-map', '0:a'])  # Map original audio
        
        cmd.extend(['-c:v', 'libx264', '-preset', 'fast', '-crf', '23'])
        cmd.extend(['-c:a', 'aac', '-b:a', '192k'])
        
        safe_name = "".join([c if c.isalnum() else "_" for c in self.project_name])
        output_file = f"{safe_name}_export.mp4"
        cmd.append(f'"{output_file}"')
        
        # Create .bat content
        bat_content = f"@echo off\n"
        bat_content += f"echo Chuan bi render MP4...\n"
        bat_content += " ".join(cmd) + "\n"
        bat_content += "pause\n"
        
        return bat_content
