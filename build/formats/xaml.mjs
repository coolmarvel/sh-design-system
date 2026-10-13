// XAML 리소스 사전 포맷 — WPF 와 Avalonia 가 같은 토큰을 같은 키로 받는다.
// 키 규칙: "Sh" + PascalCase(토큰 경로). 색은 Color + SolidColorBrush(…Brush) 두 개를 만든다.
// 그라데이션은 세로 LinearGradientBrush(…Brush). 치수·숫자는 Double, 글꼴은 FontFamily.

const pascal = (path) =>
  'Sh' +
  path
    .join('-')
    .split(/[-_.\s]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('');

// "#rrggbb" / "#rrggbbaa" → XAML "#AARRGGBB"
export const toXamlColor = (hex) => {
  const h = hex.replace('#', '').toLowerCase();
  if (h.length === 6) return `#FF${h.toUpperCase()}`;
  if (h.length === 8) return `#${(h.slice(6) + h.slice(0, 6)).toUpperCase()}`;
  if (h.length === 3)
    return `#FF${h
      .split('')
      .map((c) => c + c)
      .join('')
      .toUpperCase()}`;
  throw new Error(`XAML 색 변환 불가: ${hex}`);
};

const num = (v) => {
  const n = typeof v === 'object' && v !== null ? v.value : parseFloat(String(v));
  if (Number.isNaN(n)) throw new Error(`숫자 아님: ${JSON.stringify(v)}`);
  return n;
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function entries(token, flavor) {
  const key = pascal(token.path);
  const v = token.$value ?? token.value;
  const type = token.$type ?? token.type;
  const desc = token.$description ? `  <!-- ${esc(token.$description).replace(/--/g, '—')} -->\n` : '';
  const dbl = flavor === 'wpf' ? 'sys:Double' : 'x:Double';
  switch (type) {
    case 'color':
      return (
        desc +
        `  <Color x:Key="${key}">${toXamlColor(v)}</Color>\n` +
        `  <SolidColorBrush x:Key="${key}Brush" Color="{StaticResource ${key}}"/>\n`
      );
    case 'gradient': {
      const stops = v
        .map((s) => `      <GradientStop Color="${toXamlColor(s.color)}" Offset="${s.position}"/>`)
        .join('\n');
      const pts = flavor === 'wpf' ? 'StartPoint="0,0" EndPoint="0,1"' : 'StartPoint="0%,0%" EndPoint="0%,100%"';
      return (
        desc +
        `  <LinearGradientBrush x:Key="${key}Brush" ${pts}>\n` +
        (flavor === 'wpf' ? '' : '    <LinearGradientBrush.GradientStops>\n') +
        stops.replace(/^ {6}/gm, flavor === 'wpf' ? '    ' : '      ') +
        '\n' +
        (flavor === 'wpf' ? '' : '    </LinearGradientBrush.GradientStops>\n') +
        `  </LinearGradientBrush>\n`
      );
    }
    case 'dimension':
    case 'number':
    case 'fontWeight':
    case 'duration':
      return desc + `  <${dbl} x:Key="${key}">${num(v)}</${dbl}>\n`;
    case 'fontFamily': {
      const list = Array.isArray(v) ? v : [v];
      return desc + `  <FontFamily x:Key="${key}">${esc(list.join(', '))}</FontFamily>\n`;
    }
    default:
      // shadow·strokeStyle 등 XAML 에 대응 리소스가 없는 타입은 주석으로만 남긴다.
      return `  <!-- ${key}: ${type} — XAML 대응 없음, DESIGN.md 계약 참고 -->\n`;
  }
}

const header = (flavor, name) =>
  `<!--\n  ${name} — sh-design-system 이 생성한 파일. 직접 고치지 말 것.\n` +
  `  원본: tokens/*.json → npm run build\n-->\n`;

export const wpfFormat = {
  name: 'xaml/wpf',
  format: ({ dictionary, file }) =>
    header('wpf', file.destination) +
    '<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"\n' +
    '                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"\n' +
    '                    xmlns:sys="clr-namespace:System;assembly=mscorlib">\n' +
    dictionary.allTokens.map((t) => entries(t, 'wpf')).join('') +
    '</ResourceDictionary>\n',
};

export const avaloniaFormat = {
  name: 'xaml/avalonia',
  format: ({ dictionary, file }) =>
    header('avalonia', file.destination) +
    '<ResourceDictionary xmlns="https://github.com/avaloniaui"\n' +
    '                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">\n' +
    dictionary.allTokens.map((t) => entries(t, 'avalonia')).join('') +
    '</ResourceDictionary>\n',
};

export { pascal as xamlKey };
