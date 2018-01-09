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

function handleClick(event, url, template, $resultsContainer) {
  const $button = $(event.target);
  getApiDataForContainer(
    url,
    () => updateButtonLoading($button),
    (data) => {
      updateButtonDone($button);

      const div = template.render(data);
      $resultsContainer.html($(div));
    }
  );
}

$.templates({
  clusterInfo: (`
    <h3>Summary</h3>
    <ul>
      <li>
        Total shards: {{:num_shards_total}}
      </li>
      <li>
        Biggest shards: {{:biggest_shards.gb}}gb
        <div>
          Indices:
          <ul>
            {{for biggest_shards.shards}}
              <li>
                <code>[{{:index}}][{{:shard}}][{{:prirep}}] [{{:state}}] node[{{:node}}] bytes[{{:store}}]</code>
              </li>
            {{/for}}
          </ul>
        </div>
      </li>
      <li>
        Biggest GB group: {{:biggest_group.gb}}gb / {{:biggest_group.num_shards}} shards
      </li>
      <li>
        Shard counts by gb:
        <ul>
          {{for shards_by_gb_summary ~shardsByGb=shards_by_gb}}
            <li>
              {{:gb}}gb: {{:num_shards}}
              <div>
                {{for ~shardsByGb[gb]}}
                  <code>[{{:index}}][{{:shard}}][{{:prirep}}][{{:state}}] node[{{:node}}]</code>
                {{/for}}
              </div>
            </li>
          {{/for}}
        </ul>
      </li>
    </ul>
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
