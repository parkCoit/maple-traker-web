export const Footer = () => {
  return (
    <footer className="bg-wood-dark text-wood-lightest py-6">
      <div className="container mx-auto text-center">
        <p className="mb-4">&copy; GitHub</p>
        <div className="flex justify-center space-x-6">
          <a
            href="https://github.com/parkCoit"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-wood-light hover:text-white"
          ></a>
        </div>
      </div>
    </footer>
  );
};
