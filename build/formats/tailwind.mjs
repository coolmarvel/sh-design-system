// Tailwind 프리셋 - theme.extend 에 sh-* 이름으로 토큰을 연결한다.
// 값은 CSS 변수(var(--sh-...))를 가리켜 런타임 테마 교체가 되게 한다.
const cssVar = (t) => `var(--sh-${t.path.join('-')})`;

export const tailwindFormat = {
  name: 'tailwind/preset',
  format: ({ dictionary }) => {
    const pick = (cat) => dictionary.allTokens.filter((t) => t.path[0] === cat);
    const map = (list, strip = 1) => Object.fromEntries(list.map((t) => [t.path.slice(strip).join('-'), cssVar(t)]));
    const theme = {
      colors: { sh: map(pick('color')) },
      backgroundImage: Object.fromEntries(pick('gradient').map((t) => [`sh-${t.path.slice(1).join('-')}`, cssVar(t)])),
      fontFamily: Object.fromEntries(
        pick('font')
          .filter((t) => t.$type === 'fontFamily')
          .map((t) => [`sh-${t.path.at(-1)}`, cssVar(t)]),
      ),
      fontSize: Object.fromEntries(
        pick('font')
          .filter((t) => t.path[1] === 'size')
          .map((t) => [`sh-${t.path.at(-1)}`, cssVar(t)]),
      ),
      spacing: Object.fromEntries(
        [...pick('space'), ...pick('size')].map((t) => [`sh-${t.path.slice(1).join('-')}`, cssVar(t)]),
      ),
      borderRadius: Object.fromEntries(pick('radius').map((t) => [`sh-${t.path.slice(1).join('-')}`, cssVar(t)])),
      boxShadow: Object.fromEntries(pick('shadow').map((t) => [`sh-${t.path.slice(1).join('-')}`, cssVar(t)])),
    };
    return (
      '// sh-design-system 이 생성한 파일. 직접 고치지 말 것. (tokens/*.json -> npm run build)\n' +
      '// 사용: tailwind.config 의 presets: [require("./preset.cjs")] + css/tokens.css 를 함께 로드\n' +
      `module.exports = { theme: { extend: ${JSON.stringify(theme, null, 2)} } };\n`
    );
  },
};

// Tailwind v4 - CSS 우선 설정. `@import "tailwindcss"; @import "./theme.css";` 로 쓴다.
// v4 네임스페이스(--color-*, --font-*, --text-*, --spacing-*, --radius-*, --shadow-* ...)에 맞춰 값 자체를 넣는다.
export const tailwindV4Format = {
  name: 'tailwind/v4',
  format: ({ dictionary }) => {
    const ns = (t) => {
      const [cat, ...rest] = t.path;
      const k = rest.join('-');
      if (cat === 'color') return `--color-${k}`;
      if (cat === 'gradient') return `--background-image-${k}`;
      if (cat === 'font' && rest[0] === 'family') return `--font-${rest.slice(1).join('-')}`;
      if (cat === 'font' && rest[0] === 'size') return `--text-${rest.slice(1).join('-')}`;
      if (cat === 'font' && rest[0] === 'weight') return `--font-weight-${rest.slice(1).join('-')}`;
      if (cat === 'font' && rest[0] === 'line-height') return `--leading-${rest.slice(1).join('-')}`;
      if (cat === 'space') return `--spacing-${k}`;
      if (cat === 'size') return `--size-${k}`;
      if (cat === 'radius') return `--radius-${k}`;
      if (cat === 'shadow') return `--shadow-${k}`;
      if (cat === 'motion') return `--duration-${rest.slice(1).join('-')}`;
      return `--${t.path.join('-')}`;
    };
    const lines = dictionary.allTokens.map((t) => `  ${ns(t)}: ${t.$value ?? t.value};`);
    return (
      '/* sh-design-system 이 생성한 파일. 직접 고치지 말 것. (tokens/*.json -> npm run build)\n' +
      ' * 사용: @import "tailwindcss"; @import "./theme.css";  -> bg-canvas, text-text-secondary, h-size-control-md ... */\n' +
      `@theme {\n${lines.join('\n')}\n}\n`
    );
  },
};
