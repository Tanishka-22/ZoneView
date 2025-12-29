import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

export function FilterSidebar({
  setProjects,
  setCurrentPage,
}) {
  const initialFilters = {
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

  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Set collapsed by default on mobile
    const checkMobile = () => {
      setIsCollapsed(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const filterLabels = {
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
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    // Count active filters
    const count = Object.values(filters).filter(value => value && value !== '').length;
    setActiveFiltersCount(count);
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const res = await api.get('/projects/filters');
      setOptions(res.data);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const updateFilter = (key, value) => {
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

  const clearFilter = (key) => {
    updateFilter(key, '');
  };

  return (
    <>
      {/* Mobile Floating Toggle Button */}
      {isCollapsed && (
        <Button
          onClick={() => setIsCollapsed(false)}
          className="md:hidden fixed top-20 right-4 z-40 bg-primary text-primary-foreground shadow-lg hover-lift"
          size="sm"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      )}

      {/* Sidebar */}
      <div className={`w-full md:w-[255px] h-screen md:h-screen flex flex-col border-r bg-card animate-fade-in ${isCollapsed ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-4 border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Filters</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={activeFiltersCount === 0}
            className="flex-1 hover-lift"
          >
            Reset All
          </Button>
        </div>
      </div>

      <div className={`${isCollapsed ? 'hidden' : 'flex-1'} overflow-y-auto p-4 space-y-4`}>
        {loading && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Applying filters...</p>
            </div>
          </div>
        )}

        {Object.keys(filterLabels)
          .filter((key) => key !== 'year')
          .map((key) => (
            <div key={key} className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">{filterLabels[key]}</label>
                {filters[key] && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter(key)}
                    className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Select
                value={filters[key]}
                onValueChange={(val) => updateFilter(key, val === "__clear__" ? "" : val)}
              >
                <SelectTrigger className="hover-lift">
                  <SelectValue placeholder={`Select ${filterLabels[key]}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__">Clear {filterLabels[key]}</SelectItem>
                  {(options[key] || [])
                    .filter((opt) => opt !== "")
                    .map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ))}

        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">{filterLabels.year}</label>
            {filters.year && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter('year')}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Select
            value={filters.year}
            onValueChange={(val) => updateFilter("year", val === "__clear__" ? "" : val)}
          >
            <SelectTrigger className="hover-lift">
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

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t animate-fade-in">
            <h3 className="text-sm font-medium text-foreground mb-2">Active Filters</h3>
            <div className="flex flex-wrap gap-1">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === '') return null;
                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => clearFilter(key)}
                  >
                    {filterLabels[key]}: {value}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

