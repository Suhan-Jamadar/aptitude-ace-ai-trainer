
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import { toast } from "sonner";

interface FlashcardControlsProps {
  onSearchChange: (query: string) => void;
  onSort: () => void;
  onFilterToggle: () => void;
  sortByDateAsc: boolean;
  filterReadOnly: boolean;
}

const FlashcardControls = ({
  onSearchChange,
  onSort,
  onFilterToggle,
  sortByDateAsc,
  filterReadOnly
}: FlashcardControlsProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-custom-darkBlue1">Your Flashcards</h2>
      <div className="flex items-center space-x-2">
        <div className="relative max-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search flashcards..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          className="text-custom-darkBlue1 border-custom-darkBlue1"
          onClick={onSort}
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort by Date
        </Button>
        <Button 
          variant="outline" 
          className={`${filterReadOnly ? 'bg-custom-gold/10 text-custom-gold border-custom-gold' : 'text-custom-darkBlue1 border-custom-darkBlue1'}`}
          onClick={onFilterToggle}
        >
          <Filter className="h-4 w-4 mr-2" />
          {filterReadOnly ? 'Read Only' : 'Filter'}
        </Button>
      </div>
    </div>
  );
};

export default FlashcardControls;
