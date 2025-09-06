import CardOrder from "../CardOrder";

function ColumnOrder(props) {
  const listClasses = `flex flex-col items-center gap-y-3 p-2 w-[300px] h-[520px] overflow-y-auto overflow-x-hidden border border-gold rounded-md bg-bgHome`;
  return (
      <div>
        <div className="bg-gradient-blue p-2 w-[300px] border border-gold rounded-t-md border-b-0 text-center text-gold font-bold">
          {props.title}
        </div>
        <div className="bg-gradient-blue p-1 w-fit h-fit border border-gold rounded-md rounded-tl-none">
          <div className={listClasses}>

            {(props.orderFilter || []).map((order) => (
              <CardOrder
                key={order.id}
                order={order}
                orderStatus={props.status}
                orderSummaryId={order.id}
                onStatusChange={props.onStatusChange}
              />
            ))}
            
          </div>
        </div>
      </div>
  );
}

export default ColumnOrder;
