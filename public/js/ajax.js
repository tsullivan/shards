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

const updateButtonLoading = ($button) => $button.button('loading');
const updateButtonDone = ($button) => $button.button('reset');

function handleClick(event, url, templateSelector, containerSelector) {
  const $button = $(event.target);
  getApiDataForContainer(
    url,
    () => updateButtonLoading($button),
    (data) => {
      updateButtonDone($button);

      const div = $(templateSelector).render(data);
      $(containerSelector).html($(div));
    }
  );
}

$(document).ready(() => {
  const $goButton = $('#shard_allocation_control button');

  $goButton.click((event) => {
    handleClick(
      event,
      '/shard_allocation',
      '#shardTemplate',
      '#shard_allocation_content'
    );
  });

  $goButton.click();
});
