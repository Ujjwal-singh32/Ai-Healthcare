// /app/api/route/route.js
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const apiKey = process.env.OPENROUTE_API_KEY;

    if (!start || !end) {
      return new Response(JSON.stringify({ error: "Missing start or end coordinates" }), { status: 400 });
    }

    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch route" }), { status: 500 });
  }
}
