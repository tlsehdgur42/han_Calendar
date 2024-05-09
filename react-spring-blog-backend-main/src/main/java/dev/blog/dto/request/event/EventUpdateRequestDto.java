package dev.blog.dto.request.event;

import dev.blog.entity.Event;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventUpdateRequestDto {
    private String title;
    private String color;
    private LocalDate date;
    private String startingHour;
    private String endingHour;
    private String summary;

}
