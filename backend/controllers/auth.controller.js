let testUser = null;
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (testUser && testUser.email === email) {
    return res.status(409).json({ message: "User already exists" });
  }

  testUser = { name, email, password };

  res.status(201).json({
    message: "Signup successful",
    user: { name: testUser.name, email: testUser.email },
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!testUser || testUser.email !== email || testUser.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    message: "Login successful",
    user: { name: testUser.name, email: testUser.email },
  });
};

const logout = async (req, res) => {
  res.send("logout");
};

export { signup, login, logout };
