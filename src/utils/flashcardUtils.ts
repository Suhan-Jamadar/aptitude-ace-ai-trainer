
export const formatDate = (date: Date) => {
    if (!(date instanceof Date) && typeof date === 'string') {
      date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  