const salesOrders = [
    {
        id: "S1",
        created: "2020-01-02",
        quantity: 6,
    },
    {
        id: "S2",
        created: "2020-11-05",
        quantity: 2,
    },
    {
        id: "S3",
        created: "2019-12-04",
        quantity: 3,
    },
    {
        id: "S4",
        created: "2020-01-20",
        quantity: 2,
    },
    {
        id: "S5",
        created: "2019-12-15",
        quantity: 9,
    },
];

const purchaseOrders = [
    {
        id: "P1",
        receiving: "2020-01-04",
        quantity: 4,
    },
    {
        id: "P2",
        receiving: "2020-01-05",
        quantity: 3,
    },
    {
        id: "P3",
        receiving: "2020-02-01",
        quantity: 5,
    },
    {
        id: "P4",
        receiving: "2020-03-05",
        quantity: 1,
    },
    {
        id: "P5",
        receiving: "2020-02-20",
        quantity: 7,
    },
];



function allocate(salesOrders, purchaseOrders) {

    const allocatedOrders = [];
    let salesOrdersCopy = [...salesOrders];       // crea una copia de salesOrders
    let purchaseOrdersCopy = [...purchaseOrders]; // crea una copia de purchaseOrders

    salesOrdersCopy.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())

    purchaseOrdersCopy.sort((a, b) => new Date(a.receiving).getTime() - new Date(b.receiving).getTime())

    for (let i = 0; i < salesOrdersCopy.length; i++) {
        let salesOrder = salesOrdersCopy[i];
        let salesOrderId = salesOrder.id;
        let salesOrderQuantity = salesOrder.quantity;
        let salesOrderCreated = new Date(salesOrder.created);
        let allocatedOrder = {}
        allocatedOrder.id = salesOrderId;
        allocatedOrder.quantity = 0

        allocatedOrder.from = [];

        for (let j = 0; j < purchaseOrdersCopy.length; j++) {
            let purchaseOrder = purchaseOrdersCopy[j];
            let purchaseOrderId = purchaseOrder.id;
            let purchaseOrderQuantity = purchaseOrder.quantity;
            let purchaseOrderReceiving = new Date(purchaseOrder.receiving);


            if (allocatedOrder.quantity < salesOrderQuantity) {

                if (purchaseOrderQuantity > (salesOrderQuantity - allocatedOrder.quantity)) {
                    let rest = salesOrderQuantity - allocatedOrder.quantity
                    allocatedOrder.quantity = allocatedOrder.quantity + rest; //completed order
                    purchaseOrdersCopy[j].quantity = purchaseOrdersCopy[j].quantity - rest // refresh purchaseOrderQuantity

                    allocatedOrder.from.push(`${purchaseOrderId} sent ${rest}`); //log
                }
                else if (purchaseOrderQuantity <= (salesOrderQuantity - allocatedOrder.quantity)) {
                    allocatedOrder.quantity = allocatedOrder.quantity + purchaseOrderQuantity; //partial completed order
                    purchaseOrdersCopy[j].quantity = 0; // refresh purchaseOrderQuantity

                    allocatedOrder.from.push(`${purchaseOrderId} sent ${purchaseOrderQuantity}`); //log
                }




                if (salesOrderCreated.getTime() >= purchaseOrderReceiving.getTime()) {
                    allocatedOrder.exepected = salesOrder.created; //we have stock just in time
                } else {
                    allocatedOrder.exepected = purchaseOrder.receiving // wait for the purchase order    
                }

                //improve purchaseOrders iteration
                if (purchaseOrdersCopy[j].quantity === 0) {
                    purchaseOrdersCopy.splice(j, 1); // remove purchaseOrder from purchaseOrdersCopy because we don't have more stock
                    j = j - 1 //avoid problem with the next purchaseOrder iteration because the purchaseOrdersCopy has been modified
                }

                if (allocatedOrder.quantity === salesOrderQuantity) {

                    allocatedOrders.push(allocatedOrder);
                    salesOrdersCopy.splice(i, 1); // remove salesOrder from salesOrdersCopy because it is allocated
                    i = -1 //restart the salesOrders loop with reading the next salesOrder
                    break

                }




            }

        }
    }

    return allocatedOrders;
}

console.log(allocate(salesOrders, purchaseOrders));