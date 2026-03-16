async function run() {
  const res = await fetch('https://html.duckduckgo.com/html/?q=Growing+My+Manhole+itch.io+game');
  const text = await res.text();
  const matches = text.match(/<a class="result__snippet[^>]*>(.*?)<\/a>/g);
  if (matches) {
    matches.forEach(m => console.log(m.replace(/<[^>]+>/g, '')));
  } else {
    console.log("No matches");
  }
}
run();
