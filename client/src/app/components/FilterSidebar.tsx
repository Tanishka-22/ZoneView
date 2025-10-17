import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type FilterKey =
  | 'client'
  | 'zone'
  | 'sector'
  | 'type'
  | 'status'
  | 'city'
  | 'pmc'
  | 'designConsult'
  | 'costConsult'
  | 'year';

type Filters = Record<FilterKey, string>;

export function FilterSidebar({
  setProjects,
  setCurrentPage,
}: {
  setProjects: (projects: any[]) => void;
  setCurrentPage?: (page: number) => void;
}) {
  const initialFilters: Filters = {
    client: '',
    zone: '',
    sector: '',
    type: '',
    status: '',
    city: '',
    pmc: '',
    designConsult: '',
    costConsult: '',
    year: '',
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Record<string, string[]>>({});

  const filterLabels: Record<FilterKey, string> = {
    client: 'Client Name',
    zone: 'Zone/Region',
    sector: 'Industry Sector',
    type: 'Project Type',
    status: 'Project Status',
    city: 'City',
    pmc: 'PMC',
    designConsult: 'Design Consultant',
    costConsult: 'Cost Consultant',
    year: 'Project Year',
  };

  useEffect(() => {
    api
      .get('/projects/filters')
      .then((res) => setOptions(res.data))
      .catch((err) => console.error('Error fetching filter options:', err));
  }, []);

  const updateFilter = (key: FilterKey, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setLoading(true);

    if (setCurrentPage) setCurrentPage(1);

    api
      .get('/projects', { params: newFilters })
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setLoading(true);

    if (setCurrentPage) setCurrentPage(1);

    api
      .get('/projects')
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-[250px] h-screen flex flex-col border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center text-sm">
            Loading...
          </div>
        )}

        {(Object.keys(filterLabels) as FilterKey[])
          .filter((key) => key !== 'year')
          .map((key) => (
            <div key={key}>
              <label className="text-sm font-medium">{filterLabels[key]}</label>
              <Select
                value={filters[key]}
                onValueChange={(val) => updateFilter(key, val === "__clear__" ? "" : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={filterLabels[key]} />
                </SelectTrigger>
                <SelectContent>
                  {/* ✅ Safe "Clear" option */}
                  <SelectItem value="__clear__">Clear {filterLabels[key]}</SelectItem>

                  {(options[key] || [])
                    .filter((opt: string) => opt !== "")
                    .map((opt: string) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

            </div>
          ))}

        <div>
          <label className="text-sm font-medium">{filterLabels.year}</label>
          <Select
            value={filters.year}
            onValueChange={(val) => updateFilter("year", val === "__clear__" ? "" : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={filterLabels.year} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__clear__">Clear {filterLabels.year}</SelectItem>

              {Array.from({ length: 2025 - 1996 + 1 }, (_, i) => 1996 + i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>
      </div>
    </div>
  );
}
