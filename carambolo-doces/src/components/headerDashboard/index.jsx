function headerDashboard({title, rightContent}) {
  return (
    <div className="flex items-center justify-between w-full pl-5">
      <div className="flex bg-gradient-blue border-2 border-gold rounded-2xl items-center justify-between pr-4 flex-1 min-w-0 mr-4">
        <span className="text-3xl text-gold font-bold p-2 pl-5">{title}</span>
        {rightContent && (
          <div className="mr-2 flex items-center gap-2 flex-wrap">{rightContent}</div>
        )}
      </div>

      <div className="flex flex-col items-end bg-white bg-opacity-50 rounded-l-full px-16 p-3 mt-4 shrink-0">
        <span className="text-[#848484]">Boas Vindas</span>
        <span className="font-bold">Carambolos Doces</span>
      </div>
    </div>
  );
}

export default headerDashboard;
