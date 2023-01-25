<?php

get_header();

while (have_posts()) {
  the_post();
  page_panner();
?>


  <div class="container container--narrow page-section">
    <div class="generic-content">
      <div class="row group">
        <div class="one-third">
          <? the_post_thumbnail('professor_portrait') ?>
        </div>
        <div class="two-thirds">
          <?php
          $like_count = new WP_Query(array(
            'post_type' => 'like',
            'meta_query' => array(
              array(
                'key' => 'liked_professor_id',
                'compare' => '=',
                'value' => get_the_ID()
              )
            )
          ));
          $exist_status = 'no';
          $exist_query = null;

          if (is_user_logged_in()) {
            $exist_query = new WP_Query(array(
              'post_type' => 'like',
              'author' => get_current_user_id(),
              'meta_query' => array(
                array(
                  'key' => 'liked_professor_id',
                  'compare' => '=',
                  'value' => get_the_ID()
                )
              )
            ));
            if ($exist_query->found_posts) $exist_status = 'yes';
          }
          ?>
          <span data-like="<? echo !empty($exist_query->posts) ? $exist_query->posts[0]->ID : '' ?>" data-professor="<? the_ID() ?>" data-exists="<? echo $exist_status ?>" class="like-box">
            <i class="fa fa-heart-o" aria-hidden="true"></i>
            <i class="fa fa-heart" aria-hidden="true"></i>
            <span class="like-count"><? echo $like_count->found_posts ?></span>
          </span>
          <? the_content() ?>
        </div>
      </div>
    </div>

    <?php
    $related_programs = get_field('related_programs');

    if ($related_programs) {
      echo '<hr class="section-break" />';
      echo '<h2 class="headline headline--medium">Subject(s) Taught</h2>';
      echo '<ul class="link-list min-list">';
      foreach ($related_programs as $program) {
    ?>
        <Li><a href="<? echo get_the_permalink($program) ?>"><? echo get_the_title($program) ?></a></Li>
    <? }
      echo '</ul>';
    }

    ?>
  </div>
<?php }

get_footer()

?>