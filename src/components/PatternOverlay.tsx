interface PatternOverlayProps {
  variant?: 'both' | 'left' | 'right';
  opacity?: number;
  className?: string;
}

const PatternOverlay = ({ variant = 'both', opacity = 0.08, className = '' }: PatternOverlayProps) => {
  const style = { opacity };
  return (
    <>
      {(variant === 'both' || variant === 'left') && (
        <img
          src="/images/pattern-left.png"
          alt=""
          className={`absolute top-0 left-0 h-full w-auto pointer-events-none select-none ${className}`}
          style={style}
        />
      )}
      {(variant === 'both' || variant === 'right') && (
        <img
          src="/images/pattern-right.png"
          alt=""
          className={`absolute top-0 right-0 h-full w-auto pointer-events-none select-none ${className}`}
          style={style}
        />
      )}
    </>
  );
};

export default PatternOverlay;
