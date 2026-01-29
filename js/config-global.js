var url_global = (function () {
  if (location.host == 'projetos.minorsolucoes.com.br') return '/caio/'

  var path = window.location.pathname || '/'
  if (path.indexOf('/painel/') !== -1) {
    return path.split('/painel/')[0] + '/'
  }
  if (path.indexOf('/backend/') !== -1) {
    return path.split('/backend/')[0] + '/'
  }
  return '/'
})()

var url_api = url_global + 'backend/'

$(document).keypress(function (event) {
  if (event.which == '13') {
    event.preventDefault()
  }
})

$(function () {
  function closeSidebar() {
    var $sidebar = $('.sidebar')
    var $overlay = $('#sidebarOverlay')
    if ($sidebar.length) $sidebar.removeClass('sidebar-open')
    if ($overlay.length) $overlay.removeClass('is-open')
  }

  function updateHeaderOffsetVar() {
    try {
      var isMobile = window.matchMedia && window.matchMedia('(max-width: 991px)').matches
      var root = document.documentElement
      if (!isMobile) {
        root.style.setProperty('--panel-header-height', '0px')
        return
      }
      var header = document.querySelector('.main-header')
      if (!header) return
      var h = header.offsetHeight || 0
      root.style.setProperty('--panel-header-height', h + 'px')
    } catch (e) {
      // ignore
    }
  }

  function toggleSidebar() {
    var $sidebar = $('.sidebar')
    var $overlay = $('#sidebarOverlay')
    if (!$sidebar.length) return

    var willOpen = !$sidebar.hasClass('sidebar-open')
    $sidebar.toggleClass('sidebar-open', willOpen)
    if ($overlay.length) $overlay.toggleClass('is-open', willOpen)
  }

  $('body').on('click', '#btnSidebarToggle', function () {
    toggleSidebar()
  })

  $('body').on('click', '#sidebarOverlay', function () {
    closeSidebar()
  })

  $('body').on('click', '.sidebar a.sidebar-link', function () {
    if (window.matchMedia && window.matchMedia('(max-width: 991px)').matches) {
      closeSidebar()
    }
  })

  updateHeaderOffsetVar()
  $(window).on('resize orientationchange', function () {
    updateHeaderOffsetVar()
  })

  // Modal de confirmação global (padrão do sistema)
  if (!$('#modalConfirmGlobal').length) {
    $('body').append(`
      <div class="modal fade" id="modalConfirmGlobal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content" style="border-radius: 16px; border: none; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div class="modal-body text-center p-5">
              <div id="confirmIconContainer" style="width: 80px; height: 80px; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                <i id="confirmIcon" class="fas fa-trash" style="font-size: 32px; color: #dc2626;"></i>
              </div>
              <h4 id="confirmTitle" style="color: #1f2937; font-weight: 700; margin-bottom: 12px;">Confirmar exclusão</h4>
              <p style="color: #6b7280; margin-bottom: 32px;" id="confirmText">Deseja realmente excluir?</p>
              <div class="d-flex justify-content-center" style="gap: 12px;">
                <button type="button" class="btn btn-light px-4 py-2" data-dismiss="modal" style="border-radius: 10px; font-weight: 600; min-width: 120px;">Cancelar</button>
                <button type="button" class="btn btn-danger px-4 py-2" id="btnConfirmGlobal" style="border-radius: 10px; font-weight: 600; min-width: 120px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border: none;">
                  <i class="fas fa-trash mr-2"></i>Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
  }
})

// Função global de confirmação
var confirmCallback = null
function confirmarAcao(mensagem, callback, opcoes) {
  opcoes = opcoes || {}
  var titulo = opcoes.titulo || 'Confirmar exclusão'
  var icone = opcoes.icone || 'fa-trash'
  var corIcone = opcoes.corIcone || '#dc2626'
  var bgIcone = opcoes.bgIcone || 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
  var textoBotao = opcoes.textoBotao || '<i class="fas fa-trash mr-2"></i>Excluir'
  var bgBotao = opcoes.bgBotao || 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
  
  $('#confirmTitle').text(titulo)
  $('#confirmText').text(mensagem)
  $('#confirmIcon').removeClass().addClass('fas ' + icone).css('color', corIcone)
  $('#confirmIconContainer').css('background', bgIcone)
  $('#btnConfirmGlobal').html(textoBotao).css('background', bgBotao)
  
  confirmCallback = callback
  $('#modalConfirmGlobal').modal('show')
}

$(document).on('click', '#btnConfirmGlobal', function() {
  $('#modalConfirmGlobal').modal('hide')
  if (typeof confirmCallback === 'function') {
    confirmCallback()
  }
})

// Sistema de Toast Notifications
$(function() {
  if (!$('#toastContainer').length) {
    $('body').append('<div id="toastContainer" style="position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;"></div>')
  }
})

function mostrarToast(mensagem, tipo, duracao) {
  tipo = tipo || 'success'
  duracao = duracao || 4000
  
  var cores = {
    success: { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', icon: 'fa-check-circle' },
    error: { bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', icon: 'fa-times-circle' },
    warning: { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: 'fa-exclamation-triangle' },
    info: { bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', icon: 'fa-info-circle' }
  }
  
  var config = cores[tipo] || cores.success
  
  var toastId = 'toast_' + Date.now()
  var toastHtml = `
    <div id="${toastId}" class="toast-notification" style="
      background: ${config.bg};
      color: #fff;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 450px;
      transform: translateX(120%);
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      font-weight: 600;
      font-size: 14px;
    ">
      <i class="fas ${config.icon}" style="font-size: 20px;"></i>
      <span style="flex: 1;">${mensagem}</span>
      <button onclick="fecharToast('${toastId}')" style="background: none; border: none; color: #fff; opacity: 0.7; cursor: pointer; padding: 0; font-size: 18px;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `
  
  $('#toastContainer').append(toastHtml)
  
  // Animar entrada
  setTimeout(function() {
    $('#' + toastId).css('transform', 'translateX(0)')
  }, 50)
  
  // Auto-remover
  setTimeout(function() {
    fecharToast(toastId)
  }, duracao)
}

function fecharToast(toastId) {
  var $toast = $('#' + toastId)
  $toast.css('transform', 'translateX(120%)')
  setTimeout(function() {
    $toast.remove()
  }, 400)
}
