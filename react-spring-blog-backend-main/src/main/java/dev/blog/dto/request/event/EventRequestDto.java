package dev.blog.dto.request.event;


import dev.blog.entity.Event;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventRequestDto {
    private String title;
    private String color;
    private LocalDate date;
    private String startingHour;
    private String endingHour;
    private String summary;

    @Builder
    public static Event ofEntity(EventRequestDto request) {
        return Event.builder()
                .title(request.title)
                .color(request.color)
                .date(request.date)
                .startingHour(request.startingHour)
                .endingHour(request.endingHour)
                .summary(request.summary)
                .build();
    }
}
