// DTCG JSON - 테마를 덮어쓰고 참조를 푼 최종 토큰을 W3C DTCG 형식($type/$value) 그대로 낸다.
// 다른 토큰 도구(Figma Tokens Studio, Terrazzo 등)에 그대로 넣을 수 있다.
export const dtcgFormat = {
  name: 'json/dtcg',
  format: ({ dictionary }) => {
    const out = {};
    for (const t of dictionary.allTokens) {
      let node = out;
      for (const p of t.path.slice(0, -1)) node = node[p] ??= {};
      node[t.path.at(-1)] = {
        $type: t.$type ?? t.type,
        $value: t.$value ?? t.value,
        ...(t.$description ? { $description: t.$description } : {}),
      };
    }
    return JSON.stringify(out, null, 2) + '\n';
  },
};
