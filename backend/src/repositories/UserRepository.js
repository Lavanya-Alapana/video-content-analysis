import User from "../models/User.js";

class UserRepository {
  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async create(userData) {
    return User.create(userData);
  }

  async update(id, updates) {
    return User.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }

  async findByOrg(orgId) {
    return User.find({ orgId });
  }
}

export default new UserRepository();
