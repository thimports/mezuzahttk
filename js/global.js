;(function ($) {
  ;('use strict')
  /*==================================================================
        [ Daterangepicker ]*/
  try {
    $('.js-datepicker').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      locale: {
        format: 'DD/MM/YYYY'
      }
    })

    var myCalendar = $('.js-datepicker')
    var isClick = 0

    $(window).on('click', function () {
      isClick = 0
    })

    $(myCalendar).on('apply.daterangepicker', function (ev, picker) {
      isClick = 0
      $(this).val(picker.startDate.format('DD/MM/YYYY'))
    })

    $('.js-btn-calendar').on('click', function (e) {
      e.stopPropagation()

      if (isClick === 1) isClick = 0
      else if (isClick === 0) isClick = 1

      if (isClick === 1) {
        myCalendar.focus()
      }
    })

    $(myCalendar).on('click', function (e) {
      e.stopPropagation()
      isClick = 1
    })

    $('.daterangepicker').on('click', function (e) {
      e.stopPropagation()
    })
  } catch (er) {
    console.log(er)
  }
  /*[ Select 2 Config ]
        ===========================================================*/

  try {
    var selectSimple = $('.js-select-simple')

    selectSimple.each(function () {
      var that = $(this)
      var selectBox = that.find('select')
      var selectDropdown = that.find('.select-dropdown')
      selectBox.select2({
        dropdownParent: selectDropdown
      })
    })
  } catch (err) {
    console.log(err)
  }

  /** BUSCA CEP */

  function buscaMunicipioPorEstado(id_municipio = '') {
    if (!$('#cidade').length || !$('#uf').length) {
      return
    }
    $('#cidade')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Carregando municipios...</option>')
    $.getJSON(url_api + 'municipios/' + $('#uf').val(), function (dados) {
      $('#cidade').find('option').remove().end()
      $('#cidade').append(`<option value="0">Municipio</option>`)
      $.each(dados, function (key, value) {
        const selected = value.codigo_ibge == id_municipio ? 'selected' : ''
        $('#cidade').append(
          '<option ' +
            selected +
            ' value=' +
            value.codigo_ibge +
            '>' +
            value.nome +
            '</option>'
        )
      })
    })
  }

  $('input[name="cep"]').blur(function () {
    var cep = $.trim($('input[name="cep"]').val().replace('-', ''))
    $('input[name="endereco"]').removeAttr('disabled')
    $('input[name="bairro"]').removeAttr('disabled')
    $.getJSON(
      'https://viacep.com.br/ws/' + cep + '/json/?callback=?',
      function (dados) {
        if (!('erro' in dados)) {
          console.log(dados)
          $('input[name="endereco"]').val(dados.logradouro)
          if (dados.logradouro != '') {
            $('input[name="endereco"]').attr('disabled', 'true')
          }
          if ($('input[name="bairro"]').length) {
            $('input[name="bairro"]').val(dados.bairro)
            if (dados.bairro != '') {
              $('input[name="bairro"]').attr('disabled', 'true')
            }
          }
          if ($('select[name="uf"]').length) {
            $('select[name="uf"]')
              .val(arrEstadosSiglaCodigo[dados.uf])
              .trigger('change')
            buscaMunicipioPorEstado(dados.ibge)
          }
        }
      }
    )
  })

  $('#uf').change(function () {
    buscaMunicipioPorEstado()
  })

  var arrEstadosSiglaCodigo = Array()
  $('#uf')
    .find('option')
    .remove()
    .end()
    .append('<option value="">Carregando estados...</option>')
  $.ajax({
    url: url_api + 'estados/',
    type: 'get',
    dataType: 'json',
    contentType: false,
    processData: false,
    success: function (dados) {
      $('#uf').find('option').remove().end()
      $('#uf').append(`<option value="0">Estado</option>`)

      dados.forEach(dado => {
        $('#uf').append(
          `<option value="${dado.codigo_uf}">${dado.nome}</option>`
        )
        arrEstadosSiglaCodigo[dado.uf] = dado.codigo_uf
      })
    }
  })

  var behavior = function (val) {
      return val.replace(/\D/g, '').length === 11
        ? '(00) 00000-0000'
        : '(00) 0000-00009'
    },
    options = {
      onKeyPress: function (val, e, field, options) {
        field.mask(behavior.apply({}, arguments), options)
      }
    }

  $('#telefone').mask(behavior, options)
  $('#cep').mask('00000-000')
  $('#cpf').mask('000.000.000-00')
  $('#cpf_cancelamento').mask('000.000.000-00')

  $(function () {
    $('input[name="nome_completo"]').on('keyup', function (event) {
      var value = $(this).val()
      $(this).val(value.replace(/[^a-zA-Z'-0-9 ]/g, ''))
    })
  })

  /** FIM BUSCA CEP */
})(jQuery)
