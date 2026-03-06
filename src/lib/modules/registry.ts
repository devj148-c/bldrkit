export interface TradeModule {
  key: string
  name: string
  description: string
  icon: string // Lucide icon name
  color: string // Tailwind color class
  roles: string[] // Available roles within this module
  features: string[]
}

export const MODULE_REGISTRY: TradeModule[] = [
  {
    key: 'roofing',
    name: 'Roofing',
    description: 'Roof inspections, repairs, replacements, and storm damage restoration',
    icon: 'Home',
    color: 'text-orange-500',
    roles: ['estimator', 'crew_lead', 'installer', 'sales', 'office'],
    features: ['Roof measurements', 'Material calculator', 'Storm damage reports', 'Insurance claims'],
  },
  {
    key: 'hvac',
    name: 'HVAC',
    description: 'Heating, ventilation, and air conditioning installation and service',
    icon: 'Thermometer',
    color: 'text-blue-500',
    roles: ['technician', 'installer', 'sales', 'office'],
    features: ['Equipment tracking', 'Maintenance schedules', 'Load calculations'],
  },
  {
    key: 'plumbing',
    name: 'Plumbing',
    description: 'Residential and commercial plumbing services',
    icon: 'Droplets',
    color: 'text-cyan-500',
    roles: ['plumber', 'apprentice', 'sales', 'office'],
    features: ['Service calls', 'Parts inventory', 'Fixture tracking'],
  },
  {
    key: 'electrical',
    name: 'Electrical',
    description: 'Electrical installation, repair, and inspection services',
    icon: 'Zap',
    color: 'text-yellow-500',
    roles: ['electrician', 'apprentice', 'sales', 'office'],
    features: ['Panel schedules', 'Permit tracking', 'Inspection management'],
  },
  {
    key: 'painting',
    name: 'Painting',
    description: 'Interior and exterior painting services',
    icon: 'Paintbrush',
    color: 'text-purple-500',
    roles: ['painter', 'crew_lead', 'estimator', 'office'],
    features: ['Color tracking', 'Surface area calculator', 'Material estimates'],
  },
  {
    key: 'landscaping',
    name: 'Landscaping',
    description: 'Lawn care, hardscaping, and landscape design',
    icon: 'Trees',
    color: 'text-green-500',
    roles: ['crew_lead', 'laborer', 'designer', 'office'],
    features: ['Route planning', 'Seasonal scheduling', 'Equipment tracking'],
  },
  {
    key: 'general',
    name: 'General Contracting',
    description: 'General construction and renovation projects',
    icon: 'Hammer',
    color: 'text-stone-500',
    roles: ['project_manager', 'foreman', 'laborer', 'sales', 'office'],
    features: ['Subcontractor management', 'Permit tracking', 'Progress photos'],
  },
  {
    key: 'cleaning',
    name: 'Cleaning',
    description: 'Residential and commercial cleaning services',
    icon: 'Sparkles',
    color: 'text-pink-500',
    roles: ['cleaner', 'team_lead', 'office'],
    features: ['Recurring schedules', 'Checklist templates', 'Supply tracking'],
  },
]

export function getModule(key: string): TradeModule | undefined {
  return MODULE_REGISTRY.find((m) => m.key === key)
}

export function getModulesByKeys(keys: string[]): TradeModule[] {
  return MODULE_REGISTRY.filter((m) => keys.includes(m.key))
}
