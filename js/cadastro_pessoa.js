$('#btnEnviarFormulario').click(function () {
  window.location.href = 'https://pagamento.osenhormeupastor.site/checkout?product=4f86a50e-fcb8-11f0-b2a5-46da4690ad53'
})

var habilitarCancelamentoSite = null

$.ajax({
  url: url_api + 'configuracoes/site',
  type: 'get',
  dataType: 'json',
  contentType: false,
  processData: false,
  success: function (dados) {
    habilitarCancelamentoSite = String(dados.habilitar_cancelamento || '0')

    if (habilitarCancelamentoSite !== '1') {
      if ($('#btnSolicitarCancelamento').length) {
        $('#btnSolicitarCancelamento').hide()
      }
      if ($('#modalSolicitaCancelamento').length) {
        $('#modalSolicitaCancelamento').remove()
      }
    }
  }
})

function validarCpf(strCPF) {
  var Soma
  var Resto
  Soma = 0
  if (strCPF == '00000000000') return false

  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
  Resto = (Soma * 10) % 11

  if (Resto == 10 || Resto == 11) Resto = 0
  if (Resto != parseInt(strCPF.substring(9, 10))) return false

  Soma = 0
  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
  Resto = (Soma * 10) % 11

  if (Resto == 10 || Resto == 11) Resto = 0
  if (Resto != parseInt(strCPF.substring(10, 11))) return false
  return true
}

$('#cpf').blur(function () {
  $('.modal-title').append('')
  $('.messages').html('')
  $('.modal-buttons').css('display', 'none')
  var cpf = $.trim($('#cpf').val().replace(/\D/g, ''))
  $.ajax({
    url: url_api + 'pessoa/' + cpf,
    type: 'get',
    dataType: 'json',
    contentType: false,
    processData: false,
    success: function (dados) {
      if (dados.success == 'false') {
        $('.modal-title').html('ATENÇÃO')
        $('.messages').html(`<p>${dados.message}</p>`)

        if (dados.segunda_via == true) {
          $('.modal-buttons').css('display', 'block')
        }

        $('#modalMessages').modal()
      }
    }
  })
})


$('#btnConsultarCpfCancelamento').click(function () {
  var cpf = $.trim($('#cpf_cancelamento').val().replace(/\D/g, ''))
  $.ajax({
    url: url_api + 'pessoa/existe/' + cpf,
    type: 'get',
    dataType: 'json',
    contentType: false,
    processData: false,
    success: function (dados) {
      if (dados.exists === true) {
        $('.mensagemConfirmaCancelamento').html(`<p>CPF localizado. <br> Tem certeza que deseja cancelar a solicitação do seu Mezuzáh?</p>`)
        $("#confirmarCancelamento").css('display', 'flex')
      } else {
        $('.mensagemConfirmaCancelamento').html(`<p>CPF não localizado </p>`)
        $("#confirmarCancelamento").css('display', 'none')
      }

      $(".mensagemConfirmaCancelamento").css('display', 'block')
    }
  })
})

$('#btnSolicitarCancelamento').click(function () {

  if (habilitarCancelamentoSite !== null && habilitarCancelamentoSite !== '1') {
    return
  }

  $('#modalSolicitaCancelamento').modal()

  return;
  $('.modal-title').append('')
  $('.messages').html('')
  $('.modal-buttons').css('display', 'none')
  var cpf = $.trim($('#cpf').val().replace(/\D/g, ''))
  $.ajax({
    url: url_api + 'pessoa/' + cpf,
    type: 'get',
    dataType: 'json',
    contentType: false,
    processData: false,
    success: function (dados) {
      if (dados.success == 'false') {
        $('.modal-title').html('ATENÇÃO')
        $('.messages').html(`<p>${dados.message}</p>`)

        if (dados.segunda_via == true) {
          $('.modal-buttons').css('display', 'block')
        }

        $('#modalMessages').modal()
      }
    }
  })
})


$('#btnSegundaVia').click(function () {
  $('.close-modal').trigger('click')
  $('.modal-title').html('')
  $('.messages').html('')
  $('.modal-buttons').css('display', 'none')
  var cpf = $.trim($('#cpf').val().replace(/\D/g, ''))
  $.ajax({
    url: url_api + 'pessoa/segunda-via/' + cpf,
    type: 'post',
    dataType: 'json',
    contentType: false,
    processData: false,
    success: function (dados) {
      if (dados.success === true) {
        $('.modal-title').html('SUCESSO')
        $('.messages').html(`<p>${dados.message}</p>`)
        $('#modalMessages').modal()
      }
    }
  })
  $('#frmFormularioPrincipal')[0].reset()
  if ($('#uf').length) {
    $('#uf').select2('val', '0')
  }
})

$('#btnEnviarCancelamento').click(function () {
  var cpf = $.trim($('#cpf_cancelamento').val().replace(/\D/g, ''))
  $.ajax({
    url: url_api + 'pessoa/cancelamento/' + cpf,
    type: 'post',
    dataType: 'json',
    contentType: false,
    processData: false,
    success: function (dados) {
      if (dados.success === true) {
        $('.mensagemConfirmadoCancelamento').html(`<p>${dados.message}</p>`)
        $('.mensagemConfirmadoCancelamento').css('display', 'block')
      }
      return
    }
  })

})

$('#btnNao').click(function () {
  $('#frmFormularioPrincipal')[0].reset()
  if ($('#uf').length) {
    $('#uf').select2('val', '0')
  }
  $('.close-modal').trigger('click')
  $('.modal-title').html('')
  $('.messages').html('')
  $('.modal-buttons').css('display', 'none')
})

$('#btnNaoEnviarCancelamento').click(function () {
  $('#frmSolicitaCancelamento')[0].reset()
  $('#modalSolicitaCancelamento').trigger('click')
  $('.mensagemConfirmaCancelamento').html('')
  $('#confirmarCancelamento').css('display', 'none')
})
