// Name of the cache
const CACHE_NAME = "my-simple-cache-v1";
const URL_TO_CACHE = "/example-data";

// Install event - caching a request and response
self.addEventListener("install", function (event) {
  console.log("Service Worker installing.");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Create a Request object
      const request = new Request(URL_TO_CACHE);

      const body = JSON.stringify({ count: 1 });
      const options = {
        headers: {
          "Cache-Control": "max-age=5000",
        },
      };
      // Store the metadata in the cache

      return cache.put(request, new Response(body, options));
    })
  );
});

