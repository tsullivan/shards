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

$(document).ready(() => {
  const $goButton = $('#shard_allocation_control button');

  $goButton.click((event) => {
    const $goButton = $(event.target);

    getApiDataForContainer(
      '/shard_allocation',
      () => updateButtonLoading($goButton),
      (data) => {
        updateButtonDone($goButton);

        // render data
        const div = $('#shardSummary').render(data);
        $('#shard_summary_content').html($(div));

        // data table
        $('table.shardTable').DataTable();

        // fanciness
        $('.showAfterLoad').removeClass('hidden');
      }
    );

  });

  $goButton.click();
});

