import Project from '../models/projects.js';

export const getFilterOptions = async (req, res) => {
try {
const [clients, zones, sectors, types, years, cities, pmcs, designConsults, costConsults] = await Promise.all([
Project.distinct('client'),
Project.distinct('zone'),
Project.distinct('sector'),
Project.distinct('type'),
Project.distinct('year'),
Project.distinct('city'),
Project.distinct('pmc'),
Project.distinct('designConsult'),
Project.distinct('costConsult'),
]);
res.json({
  client: clients,
  zone: zones,
  sector: sectors,
  type: types,
  year: years,
  city: cities,
  pmc: pmcs,
  designConsult: designConsults,
  costConsult: costConsults,
});
} catch (error) {
console.error('Error fetching filter options:', error);
res.status(500).json({ message: 'Internal server error' });
}
};

