import React, { useRef } from 'react';
import { 
  HeartPulse, Brain, Bone, Baby, Eye, Ear, 
  Stethoscope, Activity, Sparkles, Dna, Pill,
  Heart
} from 'lucide-react';

const ICON_MAP = {
  'Cardiology': HeartPulse,
  'Neurology': Brain,
  'Orthopedics': Bone,
  'Pediatrics': Baby,
  'Ophthalmology': Eye,
  'ENT': Ear,
  'Dermatology': Sparkles,
  'Pulmonology': Activity,
  'General Medicine': Stethoscope,
  'Psychiatry': Brain,
  'Endocrinology': Dna,
  'Gastroenterology': Activity,
  'default': Stethoscope
};

export default function SpecialityPills({ departments = [], selected, onChange, className = "mt-4 px-6" }) {
  const scrollRef = useRef(null);

  // Ensure horizontal scrolling works seamlessly even with vertical wheel
  const handleWheel = (e) => {
    if (scrollRef.current && e.deltaY !== 0) {
      // Prevent default vertical scroll when mouse is over the pills container
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto relative ${className}`}>
      {/* Optional: Add a subtle fade on the edges to indicate scrollability */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      
      <div 
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x"
        style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {/* Style injection to completely hide webkit scrollbar for this container */}
        <style dangerouslySetInnerHTML={{__html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}} />

        <button
          onClick={() => onChange('All')}
          className={`flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 snap-start
            ${selected === 'All' 
              ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md border-transparent' 
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700'
            }`}
        >
          <Activity size={16} />
          All Specialities
        </button>

        {departments.map((dept, idx) => {
          const Icon = ICON_MAP[dept.departmentName] || ICON_MAP['default'];
          const isSelected = selected === dept.departmentName;

          return (
            <button
              key={idx}
              onClick={() => onChange(dept.departmentName)}
              className={`flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 snap-start
                ${isSelected 
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md border-transparent' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700'
                }`}
            >
              <Icon size={16} />
              {dept.departmentName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
