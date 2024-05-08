package dev.blog.dto.request.event;

import dev.blog.entity.Event;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventUpdateRequestDto {
    private String title;
    private String color;
    private String date;
    private String startingHour;
    private String endingHour;
    private String summary;

}
