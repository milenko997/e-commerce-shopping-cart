<h1>Daily Sales Report</h1>

<table border="1" cellpadding="8" cellspacing="0">
    <thead>
        <tr>
            <th>Product</th>
            <th>Quantity Sold</th>
            <th>Price</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($items as $item)
            <tr>
                <td>{{ $item->product->name }}</td>
                <td>{{ $item->stock_quantity }}</td>
                <td>{{ $item->price }} €</td>
            </tr>
        @endforeach
    </tbody>
</table>
