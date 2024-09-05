export type ModifierKey =
  | "Alt"
  | "AltGraph"
  | "CapsLock"
  | "Control"
  | "Fn"
  | "FnLock"
  | "Hyper"
  | "Meta"
  | "NumLock"
  | "ScrollLock"
  | "Shift"
  | "Super"
  | "Symbol"
  | "SymbolLock";

export type WhitespaceKey = "Enter" | "Tab" | " ";

export type NavigationKey =
  | "ArrowDown"
  | "ArrowUp"
  | "ArrowLeft"
  | "ArrowRight"
  | "End"
  | "Home"
  | "PageDown"
  | "PageUp";

export type EditingKey =
  | "Backspace"
  | "Clear"
  | "Copy"
  | "CrSel"
  | "Cut"
  | "Delete"
  | "EraseEof"
  | "ExSel"
  | "Insert"
  | "Paste"
  | "Redo"
  | "Undo";

export type UiKey =
  | "Accept"
  | "Again"
  | "Attn"
  | "Cancel"
  | "ContextMenu"
  | "Escape"
  | "Execute"
  | "Find"
  | "Finish"
  | "Help"
  | "Pause"
  | "Play"
  | "Props"
  | "Select"
  | "ZoomIn"
  | "ZoomOut";

export type DeviceKey =
  | "BrightnessDown"
  | "BrightnessUp"
  | "Eject"
  | "LogOff"
  | "Power"
  | "PowerOff"
  | "PrintScreen"
  | "Hibernate"
  | "Standby"
  | "WakeUp";

export type ImeKey =
  | "AllCandidates"
  | "Alphanumeric"
  | "CodeInput"
  | "Compose"
  | "Convert"
  | "Dead"
  | "FinalMode"
  | "GroupFirst"
  | "GroupLast"
  | "GroupNext"
  | "GroupPrevious"
  | "ModeChange"
  | "NextCandidate"
  | "NonConvert"
  | "PreviousCandidate"
  | "Process"
  | "SingleCandidate";

export type KoreanKey = "HangulMode" | "HanjaMode" | "JunjaMode";

export type JapaneseKey =
  | "Eisu"
  | "Hankaku"
  | "Hiragana"
  | "HiraganaKatakana"
  | "KanaMode"
  | "KanjiMode"
  | "Katakana"
  | "Romanji"
  | "Zenkaku"
  | "ZenkakuHanaku";

export type FunctionKey = `F${number}` | `Soft${number}`;

export type PhoneKey =
  | "AppSwitch"
  | "Call"
  | "Camera"
  | "CameraFocus"
  | "EndCall"
  | "GoBack"
  | "GoHome"
  | "HeadsetHook"
  | "LastNumberRedial"
  | "Notification"
  | "MannerMode"
  | "VoiceDial";

export type MultimediaKey =
  | "ChannelDown"
  | "ChannelUp"
  | "MediaFastForward"
  | "MediaPause"
  | "MediaPlay"
  | "MediaPlayPause"
  | "MediaRecord"
  | "MediaRewind"
  | "MediaStop"
  | "MediaTrackNext"
  | "MediaTrackPrevious";

export type AudioControlKey =
  | "AudioBalanceLeft"
  | "AudioBalanceRight"
  | "AudioBassDown"
  | "AudioBassBoostDown"
  | "AudioBassBoostToggle"
  | "AudioBassBoostUp"
  | "AudioBassUp"
  | "AudioFaderFront"
  | "AudioSurroundModeNext"
  | "AudioTrembleDown"
  | "AudioTrembleUp"
  | "AudioVolumeDown"
  | "AudioVolumeMute"
  | "AudioVolumeUp"
  | "AudioVolumeToggle"
  | "MicrophoneToggle"
  | "MicrophoneVolumeDown"
  | "MicrophoneVolumeMute"
  | "MicrophoneVolumeUp";

export type TvControlKey =
  | "TV"
  | "TV3DMode"
  | "TVAntennaCable"
  | "TVAudioDescription"
  | "TVAudioDescriptionMixDown"
  | "TVAudioDescriptionMixUp"
  | "TVContentsMenu"
  | "TVDataService"
  | "TVInput"
  | "TVInputComponent1"
  | "TVInputComponent2"
  | "TVInputComposite1"
  | "TVInputComposite2"
  | `TVInputHDMI${1 | 2 | 3 | 4}`
  | "TVInputVGA1"
  | "TVMediaContext"
  | "TVNetwork"
  | "TVNumberEntry"
  | "TVPower"
  | "TVRadioService"
  | "TVSatellite"
  | "TVSatelliteCS"
  | "TVSatelliteToggle"
  | "TVTerrestrialAnalog"
  | "TVTerrestrialDigital"
  | "TVTimer";

export type MediaControllerKey =
  | "AVRInput"
  | "AVRPower"
  | "ColorF0Red"
  | "ColorF1Green"
  | "ColorF2Yellow"
  | "ColorF3Blue"
  | "ColorF4Grey"
  | "ColorF5Brown"
  | "ClosedCaptionToggle"
  | "Dimmer"
  | "DisplaySwap"
  | "DVR"
  | "Exit"
  | `Favorite${"Clear" | "Recall" | "Store"}${0 | 1 | 2 | 3}`
  | "Guide"
  | "GuideNextDay"
  | "GuidePreviousDay"
  | "Info"
  | "InstantReplay"
  | "Link"
  | "ListProgram"
  | "LiveContent"
  | "Lock"
  | "MediaApps"
  | "MediaAudioTrack"
  | "MediaLast"
  | "MediaSkipBackward"
  | "MediaSkipForward"
  | "MediaStepBackward"
  | "MediaStepForward"
  | "MediaTopMenu"
  | "NavigateIn"
  | "NavigateNext"
  | "NavigateOut"
  | "NavigatePrevious"
  | "NextFavoriteChannel"
  | "NextUserProfile"
  | "OnDemand"
  | "Pairing"
  | "PinPDown"
  | "PinPMove"
  | "PinPToggle"
  | "PinPUp"
  | "PlaySpeedDown"
  | "PlaySpeedReset"
  | "PlaySpeedUp"
  | "RandomToggle"
  | "RcLowBattery"
  | "RecordSpeedNext"
  | "RfBypass"
  | "ScanChannelsToggle"
  | "ScreenModeNext"
  | "Settings"
  | "SplitScreenToggle"
  | "STBInput"
  | "STBPower"
  | "Subtitle"
  | "Teletext"
  | "VideoModeNext"
  | "Wink"
  | "ZoomToggle";

export type SpeechRecognitionKey = "SpeechCorrectionList" | "SpeechInputToggle";

export type DocumentKey =
  | "Close"
  | "New"
  | "Open"
  | "Print"
  | "Save"
  | "SpellCheck"
  | "MailForward"
  | "MailReply"
  | "MailSend";

export type ApplicationSelectorKey = `Launch${
  | "Calculator"
  | "Calender"
  | "Contacts"
  | "Mail"
  | "MediaPlayer"
  | "MusicPlayer"
  | "MyComputer"
  | "ScreenSaver"
  | "Spreadsheet"
  | "WebBrowser"
  | `Application${number}`}`;

export type BrowserControlKey = `Browser${"Back" | "Favorites" | "Forward" | "Home" | "Refresh" | "Search" | "Stop"}`;

export type NumericKeypadKey =
  | ","
  | "Key11"
  | "Key12"
  | "*"
  | "+"
  | "Clear"
  | "/"
  | "-"
  | "."
  | `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

export type SpecialKeys =
  | ";"
  | "'"
  | '"'
  | "["
  | "]"
  | "\\"
  | "="
  | "`"
  | "´"
  | "@"
  | "#"
  | "$"
  | "%"
  | "^"
  | "&"
  | "("
  | ")"
  | "_"
  | "{"
  | "}"
  | "|"
  | "~";

export type AlphaKey =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

export type KeyboardKey =
  | ModifierKey
  | WhitespaceKey
  | NavigationKey
  | EditingKey
  | UiKey
  | DeviceKey
  | ImeKey
  | KoreanKey
  | JapaneseKey
  | FunctionKey
  | PhoneKey
  | MultimediaKey
  | AudioControlKey
  | TvControlKey
  | MediaControllerKey
  | SpeechRecognitionKey
  | DocumentKey
  | ApplicationSelectorKey
  | BrowserControlKey
  | NumericKeypadKey
  | SpecialKeys
  | AlphaKey
  | Lowercase<AlphaKey>;
