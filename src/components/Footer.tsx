import { Link } from 'react-router-dom';
import { Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border h-16 flex items-center justify-between px-6">
      <div className="text-sm text-muted-foreground">
        © 2024 ChilledCRM. All rights reserved.
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/help" className="text-muted-foreground hover:text-foreground">Help</Link>
        <a href="https://x.com/chilled_tools" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
          <Twitter className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;