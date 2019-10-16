var id = 0;
$(document).ready(function () {
    $('form[name="createUser"]').validate({
        rules: {
            name: "required",
            email: {
                required: true,
                // Specify that email should be validated
                // by the built-in "email" rule
                email: true
            },
            address: "required",
            phone: {
                required: true,
                number: true
            }
        },
        messages: {
            name: "El campo nombre es mandatorio.",
            email: "Inserte un email valido.",
            phone: "Solo valores numericos.",
            address: "El campo dirección es mandatorio."
        },
        submitHandler: function (form) {
            var name = $('input#formName').val();
            var email = $('input#formEmail').val();
            var phone = $('input#formPhone').val();
            var address = $('input#formAddress').val();
            if (form.hasAttribute('data-target')) {
                $.post('/'+id+'/edit', {
                    name: name,
                    email: email,
                    phone: phone,
                    address: address,
                    id: id
                }, function (response) {
                    var td = [name,email,phone,address];
                    $('form[name="createUser"]')[0].reset();
                    $('#createUser').modal('hide');
                    var tr = $('#tr'+id+' td');
                    $.each(tr,function (index, value) {
                        if (index < 4)
                            tr[index].innerHTML = td[index];
                    });
                    alert(response.message);
                });
            }else {
                $.post('/new', {
                    name: name,
                    email: email,
                    phone: phone,
                    address: address
                }, function (response) {
                    $('form[name="createUser"]')[0].reset();
                    var table = $('#clientsTable');
                    $('#createUser').modal('hide');
                    if ($('#nullTable') !== null)
                        $('#nullTable').remove();
                    table.append("<tr id='tr" + response.id + "'><td>" + name + "</td><td>" + email + "</td><td>" + phone + "</td><td>" + address + "</td><td><ul class='list-unstyled'>\n" +
                        "                        <li>\n" +
                        "                            <a class='btn btn-success' onclick='showClient("+response.id+")' \n"+
                        "                               style='float: left; margin-right: 2px'><i\n" +
                        "                                        class='fa fa-eye'></i></a>\n" +
                        "                        </li>\n" +
                        "                        <li>\n" +
                        "                            <a class='btn btn-warning' onclick='editClient("+response.id+")'" +
                        "                               style='float: left; margin-right: 2px'><i\n" +
                        "                                        class='fa fa-pencil'></i></a>\n" +
                        "                        </li>\n" +
                        "                        <li>\n" +
                        "                            <a class='btn btn-danger'\n" +
                        "                               id='btnDeleteTable'\n" +
                        "                               onclick='delElement(" + response.id + ")'\n" +
                        "                               style='float: left; margin-right: 2px'><i\n" +
                        "                                        class='fa fa-trash'></i></a>\n" +
                        "                        </li>\n" +
                        "                    </ul></td></tr>");
                    alert(response.message);
                });
            }
        }
    });

    $('#btnDelete').on('click', function (e) {
        e.preventDefault();
        $.post('/' + id + '/delete', {
            id: id
        }, function (response) {
            alert(response.message);
            $('#showuser').modal('hide');
            $('#tr' + id).remove();
            verifyTable();
        });
    });

    $('#openModalCreate').on('click', function (e) {
        e.preventDefault();
        $('#createUser').modal('show');
    });
});

function verifyTable() {
    var count = document.querySelector('[id^="tr"]');
    if (count == null) {
        $('#clientsTable tbody').html("<tr id='nullTable'>\n" +
            "                <td colspan='6' id='nullTable' class='text-center'>No se encontraron elementos.</td>\n" +
            "            </tr>");
    }
}

function editClient(item) {
    $.get("/" + item, function (response) {
        var content = '';
        $('form[name="createUser"] input#formName').val(response.name);
        $('form[name="createUser"] input#formEmail').val(response.email);
        $('form[name="createUser"] input#formPhone').val(response.phone);
        $('form[name="createUser"] input#formAddress').val(response.address);
        $('form[name="createUser"]').attr('data-target','edit');
        id = item;
        $('#createUser').modal('show');
    });
}

function showClient(item) {
    id = item;
    $.get("/" + item, function (response) {
        var content = '';
        content += "<p><bold>Nombre:</bold> " + response.name + "</p><br>";
        content += "<p><bold>Email:</bold> " + response.email + "</p><br>";
        content += "<p><bold>Teléfono:</bold> " + response.phone + "</p><br>";
        content += "<p><bold>Dirección:</bold> " + response.address + "</p><br>";
        $('#contentUser').html(content);
        $('#showuser').modal('show');
    });
}

function delElement(item) {
    $.post('/' + item + '/delete', {
        id: item
    }, function (response) {
        alert(response.message);
        $('#tr' + item).remove();
        verifyTable();
    });
}
