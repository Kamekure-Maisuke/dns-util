import { parseArgs } from "@std/cli/parse-args";

// DNS応答
type DnsResoponse = {
  answers: string[];
  error?: string;
};

// レコードタイプ
const RECORD_TYPES = ["A", "AAAA", "ANAME", "CNAME", "NS", "PTR"] as const;
type RecordType = typeof RECORD_TYPES[number];

/**
 * DNS情報取得
 */
async function fetchDns(
  domain: string,
  type: RecordType,
): Promise<DnsResoponse> {
  try {
    const records = await Deno.resolveDns(domain, type);
    return {
      answers: records,
    };
  } catch (error) {
    return {
      answers: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * レコードタイプ表示
 */
function displayRecordTypes() {
  RECORD_TYPES.forEach((type) => console.log(type));
}

/**
 * DNSレスポンス表示
 */
function displayDnsResponse(response: DnsResoponse): void {
  if (response.error) {
    console.error(response.error);
    return;
  }
  response.answers.forEach((answer) => console.log(answer));
}

// 実行
async function main() {
  const args = parseArgs(Deno.args, {
    string: ["type"],
    boolean: ["types"],
  });

  if (args.types) {
    displayRecordTypes();
    Deno.exit(0);
  }

  // ドメインおよびレコードタイプ取得
  const domain = String(args._[0]);

  if (domain === "undefined") {
    console.error("ドメインは必須です。");
    Deno.exit(1);
  }

  const type = (args.type || "A") as RecordType;

  // DNS情報取得
  const result = await fetchDns(domain, type);

  if (result.error) {
    console.error(result.error);
    Deno.exit(1);
  }

  // DNS情報出力
  displayDnsResponse(result);
}

if (import.meta.main) {
  main();
}
