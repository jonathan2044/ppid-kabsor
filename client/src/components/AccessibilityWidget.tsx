import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Accessibility, Volume2, ZoomIn, ZoomOut, Contrast, Eye, EyeOff, AlignLeft, AlignCenter, AlignRight, Type, Pause, MousePointer, Space, Underline, Info, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AccessibilitySettings {
  fontSize: number;
  saturation: number;
  highContrast: boolean;
  hideImages: boolean;
  textAlign: 'left' | 'center' | 'right';
  dyslexiaFont: boolean;
  lineHeight: number;
  pauseAnimations: boolean;
  largeCursor: boolean;
  letterSpacing: number;
  underlineLinks: boolean;
  showTooltips: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  saturation: 100,
  highContrast: false,
  hideImages: false,
  textAlign: 'left',
  dyslexiaFont: false,
  lineHeight: 1.5,
  pauseAnimations: false,
  largeCursor: false,
  letterSpacing: 0,
  underlineLinks: false,
  showTooltips: true,
};

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load accessibility settings');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const applySettings = (s: AccessibilitySettings) => {
    const root = document.documentElement;
    
    root.style.fontSize = `${s.fontSize}%`;
    root.style.filter = `saturate(${s.saturation}%)`;
    root.style.setProperty('--line-height', s.lineHeight.toString());
    root.style.letterSpacing = `${s.letterSpacing}px`;
    
    if (s.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (s.hideImages) {
      root.classList.add('hide-images');
    } else {
      root.classList.remove('hide-images');
    }
    
    if (s.dyslexiaFont) {
      root.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
    } else {
      root.style.fontFamily = '';
    }
    
    if (s.pauseAnimations) {
      root.classList.add('pause-animations');
    } else {
      root.classList.remove('pause-animations');
    }
    
    if (s.largeCursor) {
      root.classList.add('large-cursor');
    } else {
      root.classList.remove('large-cursor');
    }
    
    if (s.underlineLinks) {
      root.classList.add('underline-links');
    } else {
      root.classList.remove('underline-links');
    }
    
    root.style.textAlign = s.textAlign;
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const text = document.body.innerText;
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
      utterance.lang = 'id-ID';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <>
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        data-testid="button-accessibility-toggle"
        aria-label="Toggle Accessibility Menu"
      >
        <Accessibility className="h-6 w-6 text-white" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 left-6 z-50 w-96 max-h-[600px] overflow-y-auto shadow-2xl" data-testid="panel-accessibility">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-bold">Menu Aksesibilitas (CTRL+U)</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-accessibility"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">Bahasa Indonesia (Indonesian)</Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSpeech}
                className="flex flex-col h-20 gap-1"
                data-testid="button-text-to-speech"
              >
                <Volume2 className="h-5 w-5" />
                <span className="text-xs">Moda Suara</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, fontSize: Math.min(s.fontSize + 10, 200) }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-increase-font"
              >
                <ZoomIn className="h-5 w-5" />
                <span className="text-xs">Perbesar Teks</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, fontSize: Math.max(s.fontSize - 10, 50) }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-decrease-font"
              >
                <ZoomOut className="h-5 w-5" />
                <span className="text-xs">Perkecil Teks</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, saturation: s.saturation === 100 ? 50 : 100 }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-saturation"
              >
                <Contrast className="h-5 w-5" />
                <span className="text-xs">Kejenuhan</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, highContrast: !s.highContrast }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-high-contrast"
              >
                <Contrast className="h-5 w-5" />
                <span className="text-xs">Kontras+</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, hideImages: !s.hideImages }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-hide-images"
              >
                {settings.hideImages ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                <span className="text-xs">Sembunyikan Gambar</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, textAlign: 'left' }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-align-left"
              >
                <AlignLeft className="h-5 w-5" />
                <span className="text-xs">Rata Tulisan</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, dyslexiaFont: !s.dyslexiaFont }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-dyslexia-font"
              >
                <Type className="h-5 w-5" />
                <span className="text-xs">Ramah Disleksia</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, lineHeight: s.lineHeight === 1.5 ? 2 : 1.5 }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-line-height"
              >
                <AlignCenter className="h-5 w-5" />
                <span className="text-xs">Tinggi Garis</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, pauseAnimations: !s.pauseAnimations }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-pause-animations"
              >
                <Pause className="h-5 w-5" />
                <span className="text-xs">Animasi Dijeda</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, largeCursor: !s.largeCursor }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-large-cursor"
              >
                <MousePointer className="h-5 w-5" />
                <span className="text-xs">Kursor</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, letterSpacing: s.letterSpacing === 0 ? 2 : 0 }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-letter-spacing"
              >
                <Space className="h-5 w-5" />
                <span className="text-xs">Spasi Teks</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, underlineLinks: !s.underlineLinks }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-underline-links"
              >
                <Underline className="h-5 w-5" />
                <span className="text-xs">Garis Bawahi Tautan</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings(s => ({ ...s, showTooltips: !s.showTooltips }))}
                className="flex flex-col h-20 gap-1"
                data-testid="button-show-tooltips"
              >
                <Info className="h-5 w-5" />
                <span className="text-xs">Keterangan Alat</span>
              </Button>
            </div>

            <Separator />

            <Button
              variant="default"
              className="w-full"
              onClick={resetSettings}
              data-testid="button-reset-accessibility"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Atur Ulang Semua Pengaturan Kesesiblitasan
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              - Widget Kesesiblitasan Versi 2.1 -
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
