app.get(
  "/api/test/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.adminBoard
);
