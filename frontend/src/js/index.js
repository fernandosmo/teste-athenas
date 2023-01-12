const api = 'https://teste-athenas.onrender.com/api/users';

$(function () {
  const loadPanel = $('#loadPanel')
    .dxLoadPanel({
      position: {
        of: '#gridContainer',
      },
      visible: false,
    })
    .dxLoadPanel('instance');

  loadPanel.show();

  sendRequest(`${api}/get-all`).then((data) => {
    loadPanel.hide();
    const userData = data;
    dataGrid.option('dataSource', userData);
  });

  const dataGrid = $('#gridContainer')
    .dxDataGrid({
      keyExpr: 'id',
      showBorders: true,
      dataSource: [],
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: false,
      },
      onSaving(e) {
        const change = e.changes[0];

        if (change) {
          e.cancel = true;
          e.promise = saveChange(api, change).then((data) => {
            let users = e.component.option('dataSource');
            users = DevExpress.data.applyChanges(users, [change], {
              keyExpr: 'id',
            });

            e.component.option({
              dataSource: users,
              editing: {
                editRowKey: null,
                changes: [],
              },
            });
          });
        }
      },
      scrolling: {
        rowRenderingMode: 'virtual',
      },
      paging: {
        pageSize: 10,
      },
      pager: {
        visible: true,
        allowedPageSizes: [5, 10, 'all'],
        showPageSizeSelector: true,
        showInfo: true,
        showNavigationButtons: true,
      },
      columns: [
        {
          dataField: 'name',
          caption: 'Nome',
          dataType: 'text',
        },
        {
          dataField: 'lastName',
          caption: 'Sobrenome',
          dataType: 'text',
        },
        {
          dataField: 'gender',
          caption: 'Gênero',
          dataType: 'text',
        },
        {
          dataField: 'email',
          dataType: 'text',
        },
        {
          dataField: 'birthDate',
          caption: 'Data de Nascimento',
          dataType: 'date',
          format: 'dd/MM/yyyy',
        },
      ],
      searchPanel: { visible: true },
    })
    .dxDataGrid('instance');
});

function saveChange(api, change) {
  switch (change.type) {
    case 'insert':
      return sendRequest(`${api}/create`, 'POST', JSON.stringify(change.data));
    case 'update':
      return sendRequest(`${api}/update/${change.key}`, 'PUT', {
        values: JSON.stringify(change.data),
      });
    case 'remove':
      return sendRequest(`${api}/delete/${change.key}`, 'DELETE', {
        key: change.key,
      });
    default:
      return null;
  }
}

function sendRequest(url, method = 'GET', data) {
  const d = $.Deferred();

  axios({
    method: method,
    url: url,
    headers: {
      'Content-type': 'application/json',
    },
    data: data,
  }).then(
    (result) => {
      d.resolve(method === 'GET' ? result.data.users : result);
    },
    (xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    }
  );

  return d.promise();
}

$('#create-user-btn').click(() => {
  $('.modal-content').html(`
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="exampleModalLabel">
      Adicione um novo usuário
      </h1>
        <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="modal-body">
      <div id="liveAlertPlaceholder"></div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Nome</label>
        <input class="form-control" id="name-input" type="text" placeholder="Digite o nome" required>
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Sobrenome</label>
        <input class="form-control" id="lastName-input" type="text" placeholder="Digite o sobrenome" required>
      </div>

      <div class="mb-3">
      <label for="exampleFormControlInput1" class="form-label">Email</label>
      <input type="email" class="form-control" id="email-input"  placeholder="email@example.com" required>
    </div>
    <div class='mb-3'>
      <div class="mb-3">
      <label class="form-check-label" for="flexRadioDefault" value="masculino">
          Gênero
        </label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="gender-input" value="masculino" required>
        <label class="form-check-label" for="radio-male">
          Masculino
        </label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="gender-input" value="feminino" required>
        <label class="form-check-label" for="radio-female">
          Feminino
        </label>
      </div>
    </div>
    <div class='mb-3'>
    <div >
      <label for="example">Data de Nascimento</label>
      <input type="date" id="birthDate-input" class="form-control" required>
    </div>
  </div>


    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
      >
        Fechar
      </button>
      <button type="button" id="btn-submit" class="btn btn-primary">
        Confirmar adição
      </button>
    </div>
  `);

  const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

  const alert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>',
    ].join('');

    alertPlaceholder.append(wrapper);
  };

  $('#btn-submit').click(() => {
    const name = $('#name-input').val();
    const lastName = $('#lastName-input').val();
    const email = $('#email-input').val();
    const gender = $('input[name="flexRadioDefault"]:checked').val();
    const birthDate = $('#birthDate-input').val();

    const dataUser = JSON.stringify({
      name,
      lastName,
      email,
      gender,
      birthDate,
    });

    if (
      name == '' ||
      lastName == '' ||
      email == '' ||
      gender == '' ||
      birthDate == ''
    ) {
      alert('Todos os campos devem ser preenchidos', 'danger');
    } else {
      sendRequest(`${api}/create`, 'post', dataUser)
        .then(() => {
          $('#myModal').modal('hide');
          location.reload();
        })
        .catch(() => {
          $('.modal-content').html(`
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
              Erro!
              </h1>
                <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p class="fs-4 px-4">Ocorreu um erro, por favor, verifique os dados e tente novamente.</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Fechar
              </button>
            </div>
          `);
        });
    }
  });
});
