import React, { ReactNode } from "react";

// Define the props interface
interface CommonWrapperProps {
  children: ReactNode; // Type for children (can be any valid React node)
  className?: string; // Optional className prop
  style?: React.CSSProperties; // Optional style prop
}

// Define the component
const CommonWrapper: React.FC<CommonWrapperProps> = ({
  children,
  className = "",
  style,
}) => {
  return (
    <div className={`mx-auto my-auto ${className}`} style={style}>
      {children}
    </div>
  );
};

export default CommonWrapper;
