package dev.blog.service;

import dev.blog.common.exception.ResourceNotFoundException;
import dev.blog.dto.request.event.EventRequestDto;
import dev.blog.dto.request.event.EventUpdateRequestDto;
import dev.blog.entity.Event;
import dev.blog.entity.Member;
import dev.blog.repository.EventRepository;
import dev.blog.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final MemberRepository memberRepository;


    // 캘린더 일정 등록
    @Transactional
    public Event addEvent(EventRequestDto request, Member member) {
        Event event = EventRequestDto.ofEntity(request);
        Member eventMember = getMemberByEmail(member.getEmail());
        event.setMappingMember(eventMember);
        return eventRepository.save(event);
    }

    // 캘린더 상세 일정 보기
    public Event detailEvent(Long eventId, Member member) {
        // 로그인한 사용자를 식별
        Member eventMember = getMemberByEmail(member.getEmail());

        // 해당 이벤트를 찾고, 해당 사용자가 추가한 것인지 확인
        Optional<Event> findEvent = eventRepository.findByMemberIdAndId(eventMember.getId(), eventId);
        return findEvent.orElseThrow(() -> new ResourceNotFoundException("Event", "Event ID를 찾을 수 없음", String.valueOf(eventId)));
    }

    // 캘린더 전체 일정 보기
    public List<Event> findAllEvent(Member member) {
        Member eventMember = getMemberByEmail(member.getEmail());
        List<Event> events = eventRepository.findByMember(eventMember);
        return events;
    }

    // 캘린더 일정 수정
    @Transactional
    public Event updateEvent(Member member ,Long eventId, EventUpdateRequestDto request) {
        Member eventMember = getMemberByEmail(member.getEmail());
        Event findEvent = eventRepository.findByMemberIdAndId(eventMember.getId(), eventId)
                        .orElseThrow(()-> new ResourceNotFoundException("Event", "Event ID를 찾을 수 없음", String.valueOf(eventId)));
        findEvent.updateEvent(request);
        eventRepository.save(findEvent);
        return findEvent;
    }

    // 캘린더 일정 삭제
    @Transactional
    public void deleteEvent(Member member,Long eventId) {
        Member eventMember = getMemberByEmail(member.getEmail());
        eventRepository.deleteByMemberIdAndId(eventMember.getId(), eventId);
    }

    public Event findDateEvent(LocalDate date, Member member) {
        Member eventMember = getMemberByEmail(member.getEmail());
        Event findDateEvent = eventRepository.findByMemberIdAndDate(eventMember.getId(), date)
                .orElseThrow(()-> new ResourceNotFoundException("EventDate", "Event 날짜를 찾을 수 없음", String.valueOf(date)));
        return findDateEvent;
    }





    // 이메일을 기반으로 사용자를 가져오는 메서드
    private Member getMemberByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "Member Email", email));
    }

}
