const mongoose = require('mongoose');

// Country Schema
const CountrySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Country = mongoose.model('Country', CountrySchema);

// State Schema
const StateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
});

const State = mongoose.model('State', StateSchema);

// City Schema
const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
});

const City = mongoose.model('City', CitySchema);

module.exports = { Country, State, City };
