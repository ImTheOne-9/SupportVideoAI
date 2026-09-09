"""
Module Xuất Timeline sang Final Cut Pro XML (FCPXML) và Adobe Premiere Pro XML (xmeml)
Tương thích hoàn toàn với Final Cut Pro, Adobe Premiere Pro và DaVinci Resolve.
"""

import xml.etree.ElementTree as ET
from xml.dom import minidom
from typing import List, Dict, Any
from urllib.parse import quote

class TimelineXMLExporter:
    def __init__(self, project_name: str = "Deebot T80 Max Omni", fps: float = 30.0, width: int = 3840, height: int = 2160):
        self.project_name = project_name
        self.fps = fps
        self.width = width
        self.height = height

    def sec_to_frames(self, seconds: float) -> int:
        return int(round(seconds * self.fps))

    def export_fcpxml(self, aroll_file: str, total_duration_sec: float, broll_placements: List[Dict[str, Any]]) -> str:
        """
        Sinh file Final Cut Pro XML (.fcpxml v1.9)
        """
        total_frames = self.sec_to_frames(total_duration_sec)
        frame_dur_str = "100/3000s" # 30 fps
        
        fcpxml = ET.Element("fcpxml", version="1.9")
        resources = ET.SubElement(fcpxml, "resources")
        
        # Format resource 4K
        ET.SubElement(resources, "format", id="r1", name=f"FFVideoFormat{self.height}p30",
                       frameDuration=frame_dur_str, width=str(self.width), height=str(self.height))
        
        # A-roll asset
        ET.SubElement(resources, "asset", id="r_aroll", name=aroll_file,
                       src=f"file://localhost/{quote(aroll_file)}",
                       duration=f"{total_frames*100}/3000s", hasVideo="1", hasAudio="1")

        # B-roll assets
        unique_brolls = {b["clip_id"]: b for b in broll_placements}
        for idx, b in enumerate(unique_brolls.values(), start=2):
            asset_id = f"r_broll_{b['clip_id']}"
            clip_name = b.get("clip_name", f"{b['clip_id']}.mov")
            dur_frames = self.sec_to_frames(b.get("source_duration_sec", b["duration_sec"]))
            ET.SubElement(resources, "asset", id=asset_id, name=clip_name,
                           src=f"file://localhost/{quote(clip_name)}",
                           duration=f"{dur_frames*100}/3000s", hasVideo="1")

        library = ET.SubElement(fcpxml, "library")
        event = ET.SubElement(library, "event", name=self.project_name)
        project = ET.SubElement(event, "project", name=self.project_name)
        
        sequence = ET.SubElement(project, "sequence", format="r1",
                                 duration=f"{total_frames*100}/3000s",
                                 tcStart="0s", tcFormat="NDF")
        spine = ET.SubElement(sequence, "spine")

        # Track chính (A-Roll)
        aroll_clip = ET.SubElement(spine, "asset-clip", ref="r_aroll",
                                   offset="0s", name=aroll_file,
                                   duration=f"{total_frames*100}/3000s", tcFormat="NDF")

        # Các clip B-Roll ghim lên Lane 1 (Track 2)
        for b in broll_placements:
            b_offset_frames = self.sec_to_frames(b["start_sec"])
            b_dur_frames = self.sec_to_frames(b["duration_sec"])
            
            clip_name = b.get("clip_name", f"{b['clip_id']}.mov")
            ET.SubElement(aroll_clip, "asset-clip",
                           ref=f"r_broll_{b['clip_id']}",
                           lane="1",
                           name=clip_name,
                           offset=f"{b_offset_frames*100}/3000s",
                           duration=f"{b_dur_frames*100}/3000s")

        xml_str = ET.tostring(fcpxml, encoding="utf-8")
        parsed = minidom.parseString(xml_str)
        return parsed.toprettyxml(indent="  ")

    def export_premiere_xml(self, aroll_file: str, total_duration_sec: float, broll_placements: List[Dict[str, Any]]) -> str:
        """
        Sinh file Premiere Pro XML (Chuẩn FCP7 XML / xmeml version 4)
        """
        total_frames = self.sec_to_frames(total_duration_sec)
        
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
        clip_v1 = ET.SubElement(track_v1, "clipitem", id="clipitem-aroll-1")
        ET.SubElement(clip_v1, "name").text = aroll_file
        ET.SubElement(clip_v1, "start").text = "0"
        ET.SubElement(clip_v1, "end").text = str(total_frames)
        ET.SubElement(clip_v1, "in").text = "0"
        ET.SubElement(clip_v1, "out").text = str(total_frames)
        
        # Track Video 2 (B-roll clips)
        track_v2 = ET.SubElement(video, "track")
        for idx, b in enumerate(broll_placements, start=1):
            start_frame = self.sec_to_frames(b["start_sec"])
            end_frame = self.sec_to_frames(b["end_sec"])
            dur_frame = end_frame - start_frame
            
            clipitem = ET.SubElement(track_v2, "clipitem", id=f"clipitem-broll-{idx}")
            clip_name = b.get("clip_name", f"{b['clip_id']}.mov")
            ET.SubElement(clipitem, "name").text = clip_name
            ET.SubElement(clipitem, "start").text = str(start_frame)
            ET.SubElement(clipitem, "end").text = str(end_frame)
            ET.SubElement(clipitem, "in").text = "0"
            ET.SubElement(clipitem, "out").text = str(dur_frame)
            
            file_node = ET.SubElement(clipitem, "file", id=f"file-broll-{idx}")
            ET.SubElement(file_node, "name").text = clip_name
            ET.SubElement(file_node, "pathurl").text = f"file://localhost/{quote(clip_name)}"

        xml_str = ET.tostring(xmeml, encoding="utf-8")
        parsed = minidom.parseString(xml_str)
        return parsed.toprettyxml(indent="  ")
