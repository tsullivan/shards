/* global $ */

const getApiDataForContainer = (url, onLoading, onDone) => {
  onLoading();
  $.ajax({
    url,
    success: (data) => {
      onDone(data);
    },
    dataType: 'json'
  });
};

const updateButtonLoading = ($button) => () => $button.button('loading');
const updateButtonDone = ($button) => () => $button.button('reset');

function handleClick(event, url, template, $resultsContainer) {
  const $button = $(event.target);
  getApiDataForContainer(
    url,
    updateButtonLoading($button),
    (data) => {
      const div = template.render(data);
      $resultsContainer.html($(div));

      updateButtonDone($button);
    }
  );
}

$.templates({
  clusterInfo: (`
    <div class="num_shards_total">
      Total shards: {{:num_shards_total}}
    </div>
  `),
  shardAllocation: null
});

$(document).ready(() => {
  $('#shard_allocation button').click((event) => {
    handleClick(
      event,
      '/shard_allocation',
      $.templates.shardAllocation,
      $('#tab-content-shard_allocation')
    );
  });

  $('#cluster_info button').click((event) => {
    handleClick(
      event,
      '/cluster_info',
      $.templates.clusterInfo,
      $('#tab-content-cluster_info')
    );
  });
});
