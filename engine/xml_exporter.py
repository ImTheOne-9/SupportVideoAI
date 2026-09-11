"""
Module Xuất Timeline sang Final Cut Pro XML (FCPXML) và Adobe Premiere Pro XML (xmeml)
Tương thích hoàn toàn với Final Cut Pro, Adobe Premiere Pro và DaVinci Resolve.
"""

import xml.etree.ElementTree as ET
from xml.dom import minidom
from typing import List, Dict, Any
from urllib.parse import quote

from engine.domain.edit_decision import kept_segments, remap_placements

class TimelineXMLExporter:
    def __init__(self, project_name: str = "Deebot T80 Max Omni", fps: float = 30.0, width: int = 3840, height: int = 2160):
        self.project_name = project_name
        self.fps = fps
        self.width = width
        self.height = height

    def sec_to_frames(self, seconds: float) -> int:
        return int(round(seconds * self.fps))

    def frame_time(self, frames: int) -> str:
        if abs(self.fps - 29.97) < 0.001:
            return f"{frames * 1001}/30000s"
        if abs(self.fps - 59.94) < 0.001:
            return f"{frames * 1001}/60000s"
        return f"{frames}/{int(round(self.fps))}s"

    @staticmethod
    def _value(item: Dict[str, Any], snake: str, camel: str, default: Any = None) -> Any:
        return item.get(snake, item.get(camel, default))

    def export_fcpxml(self, aroll_file: str, total_duration_sec: float, broll_placements: List[Dict[str, Any]], cuts: List[Dict[str, Any]] | None = None) -> str:
        """
        Sinh file Final Cut Pro XML (.fcpxml v1.9)
        """
        segments = kept_segments(cuts or [], total_duration_sec)
        placements = remap_placements(broll_placements, segments)
        timeline_duration = segments[-1]["timelineEndSec"] if segments else 0
        total_frames = self.sec_to_frames(timeline_duration)
        frame_dur_str = self.frame_time(1)
        
        fcpxml = ET.Element("fcpxml", version="1.9")
        resources = ET.SubElement(fcpxml, "resources")
        
        # Format resource 4K
        ET.SubElement(resources, "format", id="r1", name=f"FFVideoFormat{self.height}p30",
                       frameDuration=frame_dur_str, width=str(self.width), height=str(self.height))
        
        # A-roll asset
        ET.SubElement(resources, "asset", id="r_aroll", name=aroll_file,
                       src=f"file://localhost/{quote(aroll_file)}",
                       duration=self.frame_time(self.sec_to_frames(total_duration_sec)), hasVideo="1", hasAudio="1")

        # B-roll assets
        unique_brolls = {self._value(b, "clip_id", "clipId"): b for b in placements}
        for idx, b in enumerate(unique_brolls.values(), start=2):
            clip_id = self._value(b, "clip_id", "clipId")
            asset_id = f"r_broll_{clip_id}"
            clip_name = self._value(b, "clip_name", "clipName", f"{clip_id}.mov")
            dur_frames = self.sec_to_frames(self._value(b, "source_duration_sec", "sourceDurationSec", self._value(b, "duration_sec", "durationSec")))
            ET.SubElement(resources, "asset", id=asset_id, name=clip_name,
                           src=f"file://localhost/{quote(clip_name)}",
                           duration=self.frame_time(dur_frames), hasVideo="1")

        library = ET.SubElement(fcpxml, "library")
        event = ET.SubElement(library, "event", name=self.project_name)
        project = ET.SubElement(event, "project", name=self.project_name)
        
        sequence = ET.SubElement(project, "sequence", format="r1",
                                 duration=self.frame_time(total_frames),
                                 tcStart="0s", tcFormat="NDF")
        spine = ET.SubElement(sequence, "spine")

        # Track chính (A-Roll)
        for segment_index, segment in enumerate(segments, start=1):
            aroll_clip = ET.SubElement(
                spine, "asset-clip", ref="r_aroll",
                offset=self.frame_time(self.sec_to_frames(segment["timelineStartSec"])),
                start=self.frame_time(self.sec_to_frames(segment["sourceStartSec"])),
                name=f"{aroll_file} {segment_index}",
                duration=self.frame_time(self.sec_to_frames(segment["durationSec"])), tcFormat="NDF",
            )
            for b in placements:
                start_sec = float(self._value(b, "start_sec", "startSec", 0))
                if not segment["timelineStartSec"] <= start_sec < segment["timelineEndSec"]:
                    continue
                clip_id = self._value(b, "clip_id", "clipId")
                clip_name = self._value(b, "clip_name", "clipName", f"{clip_id}.mov")
                ET.SubElement(
                    aroll_clip, "asset-clip", ref=f"r_broll_{clip_id}", lane="1", name=clip_name,
                    offset=self.frame_time(self.sec_to_frames(start_sec)),
                    start=self.frame_time(self.sec_to_frames(self._value(b, "source_in_sec", "sourceInSec", 0))),
                    duration=self.frame_time(self.sec_to_frames(self._value(b, "duration_sec", "durationSec", 0))),
                )

        xml_str = ET.tostring(fcpxml, encoding="utf-8")
        parsed = minidom.parseString(xml_str)
        return parsed.toprettyxml(indent="  ")

    def export_premiere_xml(self, aroll_file: str, total_duration_sec: float, broll_placements: List[Dict[str, Any]], cuts: List[Dict[str, Any]] | None = None) -> str:
        """
        Sinh file Premiere Pro XML (Chuẩn FCP7 XML / xmeml version 4)
        """
        segments = kept_segments(cuts or [], total_duration_sec)
        placements = remap_placements(broll_placements, segments)
        timeline_duration = segments[-1]["timelineEndSec"] if segments else 0
        total_frames = self.sec_to_frames(timeline_duration)
        
        xmeml = ET.Element("xmeml", version="4")
        project = ET.SubElement(xmeml, "project")
        ET.SubElement(project, "name").text = self.project_name
        
        children = ET.SubElement(project, "children")
        sequence = ET.SubElement(children, "sequence")
        ET.SubElement(sequence, "name").text = self.project_name
        ET.SubElement(sequence, "duration").text = str(total_frames)
        
        rate = ET.SubElement(sequence, "rate")
        ET.SubElement(rate, "timebase").text = str(int(self.fps))
        ET.SubElement(rate, "ntsc").text = "FALSE"
        
        media = ET.SubElement(sequence, "media")
        video = ET.SubElement(media, "video")
        
        # Track Video 1 (A-roll)
        track_v1 = ET.SubElement(video, "track")
        for index, segment in enumerate(segments, start=1):
            clip_v1 = ET.SubElement(track_v1, "clipitem", id=f"clipitem-aroll-{index}")
            ET.SubElement(clip_v1, "name").text = aroll_file
            ET.SubElement(clip_v1, "start").text = str(self.sec_to_frames(segment["timelineStartSec"]))
            ET.SubElement(clip_v1, "end").text = str(self.sec_to_frames(segment["timelineEndSec"]))
            ET.SubElement(clip_v1, "in").text = str(self.sec_to_frames(segment["sourceStartSec"]))
            ET.SubElement(clip_v1, "out").text = str(self.sec_to_frames(segment["sourceEndSec"]))
        
        # Track Video 2 (B-roll clips)
        track_v2 = ET.SubElement(video, "track")
        for idx, b in enumerate(placements, start=1):
            start_frame = self.sec_to_frames(self._value(b, "start_sec", "startSec", 0))
            end_frame = self.sec_to_frames(self._value(b, "end_sec", "endSec", 0))
            
            clipitem = ET.SubElement(track_v2, "clipitem", id=f"clipitem-broll-{idx}")
            clip_id = self._value(b, "clip_id", "clipId")
            clip_name = self._value(b, "clip_name", "clipName", f"{clip_id}.mov")
            ET.SubElement(clipitem, "name").text = clip_name
            ET.SubElement(clipitem, "start").text = str(start_frame)
            ET.SubElement(clipitem, "end").text = str(end_frame)
            source_in = float(self._value(b, "source_in_sec", "sourceInSec", 0))
            source_out = self._value(b, "source_out_sec", "sourceOutSec")
            if source_out is None:
                source_out = source_in + float(self._value(b, "duration_sec", "durationSec", 0))
            ET.SubElement(clipitem, "in").text = str(self.sec_to_frames(source_in))
            ET.SubElement(clipitem, "out").text = str(self.sec_to_frames(float(source_out)))
            
            file_node = ET.SubElement(clipitem, "file", id=f"file-broll-{idx}")
            ET.SubElement(file_node, "name").text = clip_name
            ET.SubElement(file_node, "pathurl").text = f"file://localhost/{quote(clip_name)}"

        xml_str = ET.tostring(xmeml, encoding="utf-8")
        parsed = minidom.parseString(xml_str)
        return parsed.toprettyxml(indent="  ")
