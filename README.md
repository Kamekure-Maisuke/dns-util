## dns-util

```shell
# Aレコード表示
deno run --allow-net main.ts example.com

# 指定レコード表示
deno run --allow-net main.ts example.com --type=AAAA

# 対応レコードタイプ表示
deno run --allow-net main.ts example.com --types
```
