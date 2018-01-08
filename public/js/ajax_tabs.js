/* global $ */

const getApiDataForContainer = (url, $resultsContainer, onLoading, onDone) => {
  onLoading();
  $.ajax({
    url,
    success: (data) => {
      $resultsContainer.val(JSON.stringify(data));
      onDone();
    },
    dataType: 'json'
  });
};

const updateButtonLoading = ($button) => () => $button.button('loading');
const updateButtonDone = ($button) => () => $button.button('reset');

function handleClick(event, url, $resultsContainer) {
  const $button = $(event.target);
  getApiDataForContainer(
    url,
    $resultsContainer,
    updateButtonLoading($button),
    updateButtonDone($button)
  );
}

$(document).ready(() => {
  $('#shard_allocation button').click((event) => {
    handleClick(
      event,
      '/shard_allocation',
      $('#tab-content-shard_allocation')
    );
  });

  $('#cluster_info button').click((event) => {
    handleClick(
      event,
      '/cluster_info',
      $('#tab-content-cluster_info')
    );
  });
});
