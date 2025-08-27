import React from "react";

const NotAuthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl text-center">
        <h1 className="text-2xl font-semibold mb-2">Not Authorized</h1>
        <p className="text-sm text-muted-foreground">
          You do not have permission to access this section. If you believe this
          is an error, contact an administrator.
        </p>
      </div>
    </div>
  );
};

export default NotAuthorized;
