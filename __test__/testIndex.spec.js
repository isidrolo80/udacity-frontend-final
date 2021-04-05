// Import the js file to test
const serverRoutes = require("../src/server/index");
const supertest = require("supertest");


test("GET /weather", async () => {
  await supertest(serverRoutes).get("/weather")
    .expect(200)
    .then((response) => {
      //If we receive code 200 we check if its defined and if the result is the one expected
      console.log(response.text)
      expect(response.text).toBeDefined();
      expect(response.text).toBe("{ \"result\": \"The date is in the past\"}")
    });
});

test("GET /requestImage", async () => {
  await supertest(serverRoutes).get("/requestImage")
    .expect(200)
    .then((response) => {
      //If we receive code 200 we check if its defined and if the result is the one expected
      console.log(response.body.userImageURL)
      expect(response.text).toBeDefined();
    });
});

