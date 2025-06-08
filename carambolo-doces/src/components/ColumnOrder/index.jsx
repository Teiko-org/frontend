import CardOrder from "../CardOrder";

function ColumnOrder(props) {
  
  return (
      <div>
        <div className="bg-gradient-blue p-2 w-[200px] border border-gold rounded-t-md border-b-0 text-center text-gold font-bold">
          {props.title}
        </div>
        <div className="bg-gradient-blue p-1 w-fit h-fit border border-gold rounded-md rounded-tl-none">
          <div className="flex flex-col items-center gap-y-5 p-2 w-[300px] h-[680px]  overflow-x-hidden border border-gold rounded-md bg-bgHome">

            {(props.orderFilter || []).map((order) => (
              <CardOrder order={order}/>
            ))}
            
          </div>
        </div>
      </div>
  );
}

export default ColumnOrder;
