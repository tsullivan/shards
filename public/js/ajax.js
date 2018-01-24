/* global $ */

const getApiDataForContainer = (url, onLoading, onDone) => {
  onLoading();
  $.ajax({
    url,
    success: data => {
      onDone(data);
    },
    dataType: 'json'
  });
};

const updateButtonLoading = $button => $button.button('loading');
const updateButtonDone = $button => $button.button('reset');

$(document).ready(() => {
  const tablist = [
    $('#tabNav').render({ key: 'shardStates', title: 'Shards by Index State' }),
    $('#tabNav').render({ key: 'shardNodes', title: 'Shards by Node' }),
    $('#tabNav').render({ key: 'shardBytes', title: 'Shards by Bytes Size' })
  ];
  $('#mainTabList').html($(tablist.join('')));

  const tabpanes = [
    $('#tabPane').render({
      key: 'shardStates',
      title: 'Index States',
      shardApi: '/shards/states',
      template: '#shardStates'
    }),
    $('#tabPane').render({
      key: 'shardNodes',
      title: 'Nodes',
      shardApi: '/shards/nodes',
      template: '#shardNodes'
    }),
    $('#tabPane').render({
      key: 'shardBytes',
      title: 'Byte Size Groups',
      shardApi: '/shards/bytes',
      template: '#shardBytes'
    })
  ];
  $('#mainTabPanes').html($(tabpanes.join('')));

  $('#mainTabList a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
    const $loadButton = $($(this).attr('href')).find('button[data-shard-api]');
    if ($loadButton && $loadButton.text().trim() === 'Load') {
      $loadButton.click(); // don't click if it says 'Reload'
    }
  });

  const registerDataTableEvents = () => {
    // data tables
    $('.collapsibleTableContainer').on('show.bs.collapse', ({ target }) => {
      const $tableEl = $(target).find('table.shardItems');
      $tableEl.DataTable();
    });
    $('.collapsibleTableContainer').on('hide.bs.collapse', ({ target }) => {
      const $tableEl = $(target).find('table.shardItems');
      $tableEl.DataTable().destroy();
    });
  };

  $('#mainTabPanes button[data-shard-api]').click(({ target }) => {
    const $button = $(target);
    const api = $button.data('shard-api');
    const template = $button.data('template');
    getApiDataForContainer(
      api,
      () => updateButtonLoading($button),
      data => {
        updateButtonDone($button);

        // render data
        const div = $(template).render({ data });
        $(`${template}Content`).html($(div));

        registerDataTableEvents();
      }
    );
  });

  // auto run first tab content
  $('#mainTabList').find('a').first().click();
});
