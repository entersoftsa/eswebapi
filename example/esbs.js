function printGrid() {
    var gridElement = $('#grid'),
        printableContent = '',
        win = window.open('', '', 'width=800, height=500'),
        doc = win.document.open();

    var htmlStart =
            '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '<meta charset="utf-8" />' +
            '<title>Kendo UI Grid</title>' +
            '<link href="http://kendo.cdn.telerik.com/' + kendo.version + '/styles/kendo.common.min.css" rel="stylesheet" /> ' +
            '<style>' +
            'html { font: 11pt sans-serif; }' +
            '.k-grid { border-top-width: 0; }' +
            '.k-grid, .k-grid-content { height: auto !important; }' +
            '.k-grid-content { overflow: visible !important; }' +
            '.k-grid .k-grid-header th { border-top: 1px solid; }' +
            '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
            '</style>' +
            '</head>' +
            '<body>';

    var htmlEnd =
            '</body>' +
            '</html>';

    var gridHeader = gridElement.children('.k-grid-header');
    if (gridHeader[0]) {
        var thead = gridHeader.find('thead').clone().addClass('k-grid-header');
        printableContent = gridElement
            .clone()
                .children('.k-grid-header').remove()
            .end()
                .children('.k-grid-content')
                    .find('table')
                        .first()
                            .children('tbody').before(thead)
                        .end()
                    .end()
                .end()
            .end()[0].outerHTML;
    } else {
        printableContent = gridElement.clone()[0].outerHTML;
    }

    doc.write(htmlStart + printableContent + htmlEnd);
    doc.close();
    win.print();
}

$(document).ready(function () {
    var grid = $('#grid').kendoGrid({
        dataSource: {
            type: 'odata',
            transport: {
                read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products"
            },
            pageSize: 20,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true
        },
        toolbar: kendo.template($('#toolbar-template').html()),
        pageable: true,
        columns: [
            { field: 'ProductID', title: 'Product ID', width: 100 },
            { field: 'ProductName', title: 'Product Name' },
            { field: 'UnitPrice', title: 'Unit Price', width: 100 },
            { field: 'QuantityPerUnit', title: 'Quantity Per Unit' }
        ]
    });

    $('#printGrid').click(function () {
        printGrid();
    });

});
