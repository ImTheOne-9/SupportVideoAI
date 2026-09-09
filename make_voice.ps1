Add-Type -AssemblyName System.Speech
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speaker.SetOutputToWaveFile("public/sample_videos/tech_voiceover.wav")
$text = "Xin chao tat ca cac ban. Hom nay chung ta cung review danh gia chi tiet robot hut bui Deebot T80 Max Omni. Truoc het, hay quan sat tram sac tu giat say gie lau rat hien dai o day. Tiep theo, duoi gam may la cum con lan va choi quet chong roi cong nghe moi. Va cuoi cung, robot tu dong di chuyen dieu huong don dep tren san nha rat em ai."
$speaker.Speak($text)
$speaker.Dispose()
Write-Host "Voiceover generated successfully."
