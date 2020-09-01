const request = require("request-promise-native");

const baseUrl = "http://localhost:3000/people";

describe("PUT to /people/:id", () => {
  describe("Given a valid person", () => {
    let response;
    beforeEach(async () => {
      const requestOptions = {
          uri: `${baseUrl}/1`,
          json: true,
          method: "PUT",
          body: { id: 2, firstName: "Simon", lastName: "Thomas", age: 39 }
        };
        response = await request(requestOptions);
    });

    it("should return a success message", () => {
      expect(response).toBe("Update successful");
    });
  });
});  